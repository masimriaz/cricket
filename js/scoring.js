/* Freedom Cup 2026 - Live Scoring Engine - Part 1: Core & Setup */
'use strict';
var FC = (function() {
var match = null;
var innings = null;
var undoStack = [];
var TEAMS = ['HQ Green','Monroe Hawks','Zalmi SuperStrikers','Young Fighters','WMCC','Rangbaaz','HQ Blue','Afghan 11','MSC','Punjab Tigers'];
var MAX_OVERS = 6;
var MAX_WICKETS = 8;
var MAX_BOWLER_OVERS = 2;
var PLAYERS_PER_SIDE = 9;

function init() {
  var active = localStorage.getItem('fc2026_active_match');
  if (active) {
    var saved = localStorage.getItem('fc2026_match_' + active);
    if (saved) {
      var m = JSON.parse(saved);
      if (m.status !== 'completed') {
        match = m;
        document.getElementById('resumeInfo').innerHTML =
          '<p class="text-white fw-bold mb-1">' + m.teams.home.name + ' vs ' + m.teams.away.name + '</p>' +
          '<p class="text-white-50 small mb-0">' + m.round + ' | Pitch ' + m.pitch + ' | Status: ' + m.status + '</p>';
        showScreen('screenResume');
        return;
      }
    }
  }
  showScreen('screenSetup');
  showPreviousMatches();
  // Pre-fill from URL parameters (from schedule links)
  var params = new URLSearchParams(window.location.search);
  if (params.get('r')) { document.getElementById('setupRound').value = params.get('r'); }
  if (params.get('p')) { document.getElementById('setupPitch').value = params.get('p'); }
  if (params.get('t1')) { document.getElementById('setupTeamA').value = params.get('t1'); }
  if (params.get('t2')) { document.getElementById('setupTeamB').value = params.get('t2'); }
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(function(s) { s.classList.add('d-none'); });
  document.getElementById(id).classList.remove('d-none');
  window.scrollTo(0, 0);
}

function showPreviousMatches() {
  var idx = JSON.parse(localStorage.getItem('fc2026_matches_index') || '[]');
  var el = document.getElementById('previousMatches');
  if (idx.length === 0) { el.innerHTML = ''; return; }
  var html = '<div class="card-dark p-3"><h6 class="text-gold fw-bold mb-2"><i class="bi bi-clock-history me-1"></i>Previous Matches</h6>';
  idx.slice(-5).reverse().forEach(function(m) {
    html += '<div class="d-flex justify-content-between align-items-center py-1 border-bottom border-secondary">';
    html += '<span class="small text-white">' + m.teams + '</span>';
    html += '<span class="small ' + (m.status === 'completed' ? 'text-success' : 'text-warning') + '">' + (m.result || m.status) + '</span>';
    html += '</div>';
  });
  html += '</div>';
  el.innerHTML = html;
}

function setupNext() {
  var teamA = document.getElementById('setupTeamA').value;
  var teamB = document.getElementById('setupTeamB').value;
  if (!teamA || !teamB) { alert('Please select both teams'); return; }
  if (teamA === teamB) { alert('Teams must be different'); return; }
  var round = document.getElementById('setupRound').value;
  var pitch = document.getElementById('setupPitch').value;
  var tossWinner = document.getElementById('setupTossWinner').value;
  var tossChoice = document.getElementById('setupTossChoice').value;
  var tossTeam = tossWinner === 'A' ? teamA : teamB;
  var battingTeam, bowlingTeam;
  if ((tossWinner === 'A' && tossChoice === 'bat') || (tossWinner === 'B' && tossChoice === 'bowl')) {
    battingTeam = teamA; bowlingTeam = teamB;
  } else {
    battingTeam = teamB; bowlingTeam = teamA;
  }
  var matchId = round + '_P' + pitch;
  match = {
    matchId: matchId, round: round, pitch: pitch, status: 'lineup_entry',
    toss: { winner: tossTeam, decision: tossChoice },
    teams: {
      home: { name: teamA, players: [] },
      away: { name: teamB, players: [] }
    },
    battingFirst: battingTeam, bowlingFirst: bowlingTeam,
    innings: [null, null], result: null,
    createdAt: new Date().toISOString()
  };
  // Build player inputs
  document.getElementById('battingTeamLabel').textContent = '🏏 ' + battingTeam + ' (Batting)';
  document.getElementById('bowlingTeamLabel').textContent = '⚾ ' + bowlingTeam + ' (Bowling)';
  var batHtml = '', bowlHtml = '';
  for (var i = 1; i <= PLAYERS_PER_SIDE; i++) {
    batHtml += '<input type="text" class="player-input" id="batPlayer' + i + '" placeholder="Batsman ' + i + '">';
    bowlHtml += '<input type="text" class="player-input" id="bowlPlayer' + i + '" placeholder="Bowler/Fielder ' + i + '">';
  }
  document.getElementById('battingPlayersInputs').innerHTML = batHtml;
  document.getElementById('bowlingPlayersInputs').innerHTML = bowlHtml;
  showScreen('screenPlayers');
}

function startMatch() {
  var batPlayers = [], bowlPlayers = [];
  for (var i = 1; i <= PLAYERS_PER_SIDE; i++) {
    var bn = document.getElementById('batPlayer' + i).value.trim() || ('Batsman ' + i);
    var bwn = document.getElementById('bowlPlayer' + i).value.trim() || ('Player ' + i);
    batPlayers.push({ id: i, name: bn });
    bowlPlayers.push({ id: i, name: bwn });
  }
  if (match.teams.home.name === match.battingFirst) {
    match.teams.home.players = batPlayers;
    match.teams.away.players = bowlPlayers;
  } else {
    match.teams.away.players = batPlayers;
    match.teams.home.players = bowlPlayers;
  }
  match.status = 'innings1';
  innings = createInnings(1, match.battingFirst, match.bowlingFirst, batPlayers, bowlPlayers, null);
  match.innings[0] = innings;
  saveMatch();
  localStorage.setItem('fc2026_active_match', match.matchId);
  showBowlerSelection();
}

function createInnings(num, battingTeamName, bowlingTeamName, batPlayers, bowlPlayers, target) {
  return {
    inningsNumber: num, battingTeam: battingTeamName, bowlingTeam: bowlingTeamName,
    totalRuns: 0, totalWickets: 0, legalBalls: 0, totalBallsDelivered: 0,
    extras: { wides: 0, noBalls: 0, byes: 0, legByes: 0, total: 0 },
    target: target, isComplete: false, isFreeHit: false,
    batPlayers: batPlayers, bowlPlayers: bowlPlayers,
    battingCard: batPlayers.map(function(p, idx) {
      return { playerId: p.id, name: p.name, battingPosition: idx + 1, runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false, dismissal: null, didNotBat: idx >= 2 };
    }),
    bowlingCard: bowlPlayers.map(function(p) {
      return { playerId: p.id, name: p.name, overs: 0, balls: 0, maidens: 0, runs: 0, wickets: 0, wides: 0, noBalls: 0 };
    }),
    striker: 0, nonStriker: 1, currentBowlerIdx: -1, lastBowlerIdx: -1,
    overBalls: [], overs: [], ballLog: [], fallOfWickets: [], nextBatIdx: 2
  };
}

function resumeMatch() {
  if (!match) return;
  if (match.status === 'innings1' || match.status === 'innings2') {
    var idx = match.status === 'innings1' ? 0 : 1;
    innings = match.innings[idx];
    renderScoring();
    showScreen('screenScoring');
  } else if (match.status === 'innings_break') {
    showInningsBreak();
  } else {
    showScreen('screenSetup');
  }
}

function abandonResume() {
  localStorage.removeItem('fc2026_active_match');
  match = null;
  showScreen('screenSetup');
  showPreviousMatches();
}

function saveMatch() {
  if (!match) return;
  match.updatedAt = new Date().toISOString();
  localStorage.setItem('fc2026_match_' + match.matchId, JSON.stringify(match));
  // Update index
  var idx = JSON.parse(localStorage.getItem('fc2026_matches_index') || '[]');
  var found = false;
  for (var i = 0; i < idx.length; i++) {
    if (idx[i].matchId === match.matchId) {
      idx[i].status = match.status;
      idx[i].result = match.result ? match.result.resultString : null;
      found = true; break;
    }
  }
  if (!found) {
    idx.push({ matchId: match.matchId, teams: match.teams.home.name + ' vs ' + match.teams.away.name, status: match.status, result: null });
  }
  localStorage.setItem('fc2026_matches_index', JSON.stringify(idx));
}


/* Part 2: Scoring Logic */
function getOversDisplay(balls) {
  return Math.floor(balls / 6) + '.' + (balls % 6);
}

function getCRR() {
  if (!innings || innings.legalBalls === 0) return '0.00';
  return (innings.totalRuns / (innings.legalBalls / 6)).toFixed(2);
}

function getRRR() {
  if (!innings || !innings.target || innings.legalBalls >= MAX_OVERS * 6) return null;
  var remaining = (MAX_OVERS * 6) - innings.legalBalls;
  if (remaining <= 0) return null;
  var needed = innings.target - innings.totalRuns;
  return (needed / (remaining / 6)).toFixed(2);
}

function rotateStrike() {
  var tmp = innings.striker;
  innings.striker = innings.nonStriker;
  innings.nonStriker = tmp;
}

function scoreRuns(runs) {
  if (!innings || innings.isComplete) return;
  var ball = { runs: runs, extras: 0, extraType: null, isLegal: true, isWicket: false, isBoundary: runs >= 4 };
  // Update batter
  var bc = innings.battingCard[innings.striker];
  bc.runs += runs;
  bc.balls += 1;
  if (runs === 4) bc.fours++;
  if (runs === 6) bc.sixes++;
  bc.didNotBat = false;
  // Update bowler
  var bwc = innings.bowlingCard[innings.currentBowlerIdx];
  bwc.runs += runs;
  bwc.balls += 1;
  // Update innings
  innings.totalRuns += runs;
  innings.legalBalls += 1;
  innings.totalBallsDelivered += 1;
  // Free hit consumed
  var wasFreeHit = innings.isFreeHit;
  innings.isFreeHit = false;
  // Over ball tracking
  innings.overBalls.push({ runs: runs, type: runs === 0 ? 'dot' : (runs === 4 ? 'four' : (runs === 6 ? 'six' : 'run')), display: runs === 0 ? '●' : String(runs) });
  // Ball log
  innings.ballLog.push(ball);
  undoStack.push(JSON.parse(JSON.stringify(innings)));
  if (undoStack.length > 6) undoStack.shift();
  // Rotate strike on odd runs
  if (runs % 2 === 1) rotateStrike();
  // Check end of over / innings
  checkOverEnd();
  checkInningsEnd();
  saveMatch();
  renderScoring();
}

function scoreWide() {
  if (!innings || innings.isComplete) return;
  var ball = { runs: 0, extras: 1, extraType: 'wide', isLegal: false, isWicket: false };
  innings.totalRuns += 1;
  innings.extras.wides += 1;
  innings.extras.total += 1;
  innings.totalBallsDelivered += 1;
  var bwc = innings.bowlingCard[innings.currentBowlerIdx];
  bwc.runs += 1;
  bwc.wides += 1;
  innings.overBalls.push({ runs: 1, type: 'wide', display: 'Wd' });
  innings.ballLog.push(ball);
  undoStack.push(JSON.parse(JSON.stringify(innings)));
  if (undoStack.length > 6) undoStack.shift();
  // Wide on free hit keeps free hit active
  saveMatch();
  renderScoring();
}

function scoreNoBall() {
  if (!innings || innings.isComplete) return;
  showRunsPrompt('No Ball', 'Runs off bat (excluding the +1 penalty):', function(runs) {
    var ball = { runs: runs, extras: 1, extraType: 'no_ball', isLegal: false, isWicket: false };
    innings.totalRuns += 1 + runs;
    innings.extras.noBalls += 1;
    innings.extras.total += 1;
    innings.totalBallsDelivered += 1;
    var bc = innings.battingCard[innings.striker];
    bc.runs += runs;
    bc.balls += 1;
    if (runs === 4) bc.fours++;
    if (runs === 6) bc.sixes++;
    bc.didNotBat = false;
    var bwc = innings.bowlingCard[innings.currentBowlerIdx];
    bwc.runs += 1 + runs;
    bwc.noBalls += 1;
    innings.overBalls.push({ runs: 1 + runs, type: 'noball', display: 'NB+' + runs });
    innings.isFreeHit = true;
    innings.ballLog.push(ball);
    undoStack.push(JSON.parse(JSON.stringify(innings)));
    if (undoStack.length > 6) undoStack.shift();
    if (runs % 2 === 1) rotateStrike();
    saveMatch();
    renderScoring();
  });
}

function scoreBye() {
  if (!innings || innings.isComplete) return;
  showRunsPrompt('Bye', 'Bye runs:', function(runs) {
    var ball = { runs: 0, extras: runs, extraType: 'bye', isLegal: true, isWicket: false };
    innings.totalRuns += runs;
    innings.extras.byes += runs;
    innings.extras.total += runs;
    innings.legalBalls += 1;
    innings.totalBallsDelivered += 1;
    var bc = innings.battingCard[innings.striker];
    bc.balls += 1;
    bc.didNotBat = false;
    var bwc = innings.bowlingCard[innings.currentBowlerIdx];
    bwc.balls += 1;
    innings.overBalls.push({ runs: runs, type: 'bye', display: 'B' + runs });
    var wasFreeHit = innings.isFreeHit;
    innings.isFreeHit = false;
    innings.ballLog.push(ball);
    undoStack.push(JSON.parse(JSON.stringify(innings)));
    if (undoStack.length > 6) undoStack.shift();
    if (runs % 2 === 1) rotateStrike();
    checkOverEnd();
    checkInningsEnd();
    saveMatch();
    renderScoring();
  });
}

function scoreLegBye() {
  if (!innings || innings.isComplete) return;
  showRunsPrompt('Leg Bye', 'Leg bye runs:', function(runs) {
    var ball = { runs: 0, extras: runs, extraType: 'leg_bye', isLegal: true, isWicket: false };
    innings.totalRuns += runs;
    innings.extras.legByes += runs;
    innings.extras.total += runs;
    innings.legalBalls += 1;
    innings.totalBallsDelivered += 1;
    var bc = innings.battingCard[innings.striker];
    bc.balls += 1;
    bc.didNotBat = false;
    var bwc = innings.bowlingCard[innings.currentBowlerIdx];
    bwc.balls += 1;
    innings.overBalls.push({ runs: runs, type: 'bye', display: 'LB' + runs });
    innings.isFreeHit = false;
    innings.ballLog.push(ball);
    undoStack.push(JSON.parse(JSON.stringify(innings)));
    if (undoStack.length > 6) undoStack.shift();
    if (runs % 2 === 1) rotateStrike();
    checkOverEnd();
    checkInningsEnd();
    saveMatch();
    renderScoring();
  });
}

function showRunsPrompt(title, desc, callback) {
  document.getElementById('runsModalTitle').textContent = title;
  document.getElementById('runsModalDesc').textContent = desc;
  var btnsHtml = '';
  [0,1,2,3,4,6].forEach(function(r) {
    btnsHtml += '<button class="btn btn-outline-light btn-lg px-3" onclick="FC.closeRunsModal(' + r + ')">' + r + '</button>';
  });
  document.getElementById('runsModalButtons').innerHTML = btnsHtml;
  window._runsCallback = callback;
  var modal = new bootstrap.Modal(document.getElementById('runsModal'));
  modal.show();
}

function closeRunsModal(runs) {
  bootstrap.Modal.getInstance(document.getElementById('runsModal')).hide();
  if (window._runsCallback) {
    window._runsCallback(runs);
    window._runsCallback = null;
  }
}


/* Part 3: Wickets, Over/Innings End */
function scoreWicket() {
  if (!innings || innings.isComplete) return;
  if (innings.isFreeHit) {
    // On free hit, only run out allowed
    showFreeHitWicket();
    return;
  }
  showWicketModal();
}

function showFreeHitWicket() {
  var bowlPlayers = innings.bowlPlayers;
  var html = '<p class="text-warning small"><i class="bi bi-shield-fill me-1"></i>FREE HIT: Only Run Out is valid</p>';
  html += '<div class="mb-3"><label class="form-label text-white-50">Who is out?</label>';
  html += '<select class="form-select bg-dark text-white" id="wktBatter">';
  html += '<option value="striker">' + innings.battingCard[innings.striker].name + ' (Striker)</option>';
  html += '<option value="nonstriker">' + innings.battingCard[innings.nonStriker].name + ' (Non-Striker)</option>';
  html += '</select></div>';
  html += '<div class="mb-3"><label class="form-label text-white-50">Fielder</label>';
  html += '<select class="form-select bg-dark text-white" id="wktFielder">';
  bowlPlayers.forEach(function(p) { html += '<option value="' + p.id + '">' + p.name + '</option>'; });
  html += '</select></div>';
  html += '<div class="mb-3"><label class="form-label text-white-50">Runs completed before run out</label>';
  html += '<select class="form-select bg-dark text-white" id="wktRuns"><option>0</option><option>1</option><option>2</option></select></div>';
  html += '<input type="hidden" id="wktType" value="run_out">';
  document.getElementById('wicketModalBody').innerHTML = html;
  var modal = new bootstrap.Modal(document.getElementById('wicketModal'));
  modal.show();
}

function showWicketModal() {
  var bowlPlayers = innings.bowlPlayers;
  var html = '<div class="mb-3"><label class="form-label text-white-50">Dismissal Type</label>';
  html += '<select class="form-select bg-dark text-white" id="wktType" onchange="FC.wktTypeChange()">';
  html += '<option value="bowled">Bowled</option><option value="caught">Caught</option>';
  html += '<option value="run_out">Run Out</option><option value="stumped">Stumped</option>';
  html += '<option value="hit_wicket">Hit Wicket</option></select></div>';
  html += '<div class="mb-3" id="wktBatterDiv"><label class="form-label text-white-50">Who is out?</label>';
  html += '<select class="form-select bg-dark text-white" id="wktBatter">';
  html += '<option value="striker">' + innings.battingCard[innings.striker].name + ' (Striker)</option>';
  html += '<option value="nonstriker">' + innings.battingCard[innings.nonStriker].name + ' (Non-Striker)</option>';
  html += '</select></div>';
  html += '<div class="mb-3 d-none" id="wktFielderDiv"><label class="form-label text-white-50">Fielder/Catcher</label>';
  html += '<select class="form-select bg-dark text-white" id="wktFielder">';
  bowlPlayers.forEach(function(p) { html += '<option value="' + p.id + '">' + p.name + '</option>'; });
  html += '</select></div>';
  html += '<div class="mb-3 d-none" id="wktRunsDiv"><label class="form-label text-white-50">Runs before dismissal</label>';
  html += '<select class="form-select bg-dark text-white" id="wktRuns"><option>0</option><option>1</option><option>2</option></select></div>';
  document.getElementById('wicketModalBody').innerHTML = html;
  wktTypeChange();
  var modal = new bootstrap.Modal(document.getElementById('wicketModal'));
  modal.show();
}

function wktTypeChange() {
  var type = document.getElementById('wktType').value;
  var fielderDiv = document.getElementById('wktFielderDiv');
  var runsDiv = document.getElementById('wktRunsDiv');
  if (type === 'caught' || type === 'run_out' || type === 'stumped') {
    fielderDiv.classList.remove('d-none');
  } else {
    fielderDiv.classList.add('d-none');
  }
  if (type === 'run_out') {
    runsDiv.classList.remove('d-none');
  } else {
    runsDiv.classList.add('d-none');
  }
}

function confirmWicket() {
  bootstrap.Modal.getInstance(document.getElementById('wicketModal')).hide();
  var type = document.getElementById('wktType').value;
  var batterSel = document.getElementById('wktBatter').value;
  var batterIdx = batterSel === 'striker' ? innings.striker : innings.nonStriker;
  var runs = 0;
  if (type === 'run_out') {
    runs = parseInt(document.getElementById('wktRuns').value) || 0;
  }
  var fielder = null;
  if (type === 'caught' || type === 'run_out' || type === 'stumped') {
    var fid = document.getElementById('wktFielder').value;
    var fp = innings.bowlPlayers.find(function(p) { return p.id == fid; });
    fielder = fp ? fp.name : '';
  }
  // Update batting card
  var bc = innings.battingCard[batterIdx];
  bc.isOut = true;
  bc.didNotBat = false;
  var bowlerName = innings.bowlingCard[innings.currentBowlerIdx].name;
  if (type === 'bowled') bc.dismissal = 'b ' + bowlerName;
  else if (type === 'caught') bc.dismissal = 'c ' + fielder + ' b ' + bowlerName;
  else if (type === 'run_out') bc.dismissal = 'run out (' + fielder + ')';
  else if (type === 'stumped') bc.dismissal = 'st ' + fielder + ' b ' + bowlerName;
  else if (type === 'hit_wicket') bc.dismissal = 'hit wicket b ' + bowlerName;
  // Striker faces ball (unless run out of non-striker on dot)
  if (batterSel === 'striker') {
    bc.balls += 1;
  }
  // Runs scored
  if (runs > 0) {
    innings.totalRuns += runs;
    if (batterSel === 'striker') innings.battingCard[innings.striker].runs += runs;
  }
  // Bowler gets wicket (except run out)
  var bwc = innings.bowlingCard[innings.currentBowlerIdx];
  if (type !== 'run_out') {
    bwc.wickets += 1;
  }
  bwc.balls += 1;
  // Update innings
  innings.totalWickets += 1;
  innings.legalBalls += 1;
  innings.totalBallsDelivered += 1;
  innings.isFreeHit = false;
  innings.overBalls.push({ runs: 0, type: 'wicket', display: 'W' });
  innings.fallOfWickets.push({ wicket: innings.totalWickets, runs: innings.totalRuns, overs: getOversDisplay(innings.legalBalls), batter: bc.name });
  innings.ballLog.push({ runs: runs, extras: 0, extraType: null, isLegal: true, isWicket: true, wicketType: type, batterOut: bc.name });
  undoStack.push(JSON.parse(JSON.stringify(innings)));
  if (undoStack.length > 6) undoStack.shift();
  if (runs % 2 === 1) rotateStrike();
  // Bring in new batter
  if (innings.totalWickets < MAX_WICKETS && innings.nextBatIdx < PLAYERS_PER_SIDE) {
    var newBatIdx = innings.nextBatIdx;
    innings.battingCard[newBatIdx].didNotBat = false;
    if (batterIdx === innings.striker) {
      innings.striker = newBatIdx;
    } else {
      innings.nonStriker = newBatIdx;
    }
    innings.nextBatIdx++;
  }
  checkOverEnd();
  checkInningsEnd();
  saveMatch();
  renderScoring();
}

function checkOverEnd() {
  var ballsInOver = 0;
  // Count legal balls in current over
  for (var i = innings.ballLog.length - 1; i >= 0; i--) {
    var b = innings.ballLog[i];
    if (b.isLegal) ballsInOver++;
    if (ballsInOver >= 6) break;
    if (b._overStart) break;
  }
  // Simpler: use legalBalls mod 6
  if (innings.legalBalls > 0 && innings.legalBalls % 6 === 0 && !innings.isComplete) {
    // Over complete
    var bwc = innings.bowlingCard[innings.currentBowlerIdx];
    bwc.overs++;
    innings.overs.push({ bowler: bwc.name, overNum: innings.overs.length + 1, balls: innings.overBalls.slice() });
    innings.overBalls = [];
    innings.lastBowlerIdx = innings.currentBowlerIdx;
    // Rotate strike at end of over
    rotateStrike();
    // Check if innings is over
    if (innings.legalBalls >= MAX_OVERS * 6) return;
    // Prompt for next bowler
    showBowlerSelection();
  }
}

function checkInningsEnd() {
  if (innings.isComplete) return;
  var ended = false;
  var reason = '';
  if (innings.legalBalls >= MAX_OVERS * 6) { ended = true; reason = 'overs_complete'; }
  if (innings.totalWickets >= MAX_WICKETS) { ended = true; reason = 'all_out'; }
  if (innings.target && innings.totalRuns >= innings.target) { ended = true; reason = 'target_chased'; }
  if (ended) {
    innings.isComplete = true;
    innings.endReason = reason;
    // Finalize bowler overs if mid-over
    if (innings.legalBalls % 6 !== 0 && innings.currentBowlerIdx >= 0) {
      // partial over already counted in balls
    }
    if (innings.inningsNumber === 1) {
      match.status = 'innings_break';
      match.innings[0] = innings;
      saveMatch();
      showInningsBreak();
    } else {
      match.status = 'completed';
      match.innings[1] = innings;
      calculateResult();
      saveMatch();
      showResult();
    }
  }
}

function showBowlerSelection() {
  var html = '<p class="text-white-50 small mb-2">Over ' + (innings.overs.length + 1) + ' of ' + MAX_OVERS + '</p>';
  var oversUsed = innings.overs.length;
  var oversLeft = MAX_OVERS - oversUsed;
  innings.bowlPlayers.forEach(function(p, idx) {
    var bc = innings.bowlingCard[idx];
    var disabled = '';
    var note = '';
    if (bc.overs >= MAX_BOWLER_OVERS) { disabled = 'disabled'; note = ' (maxed)'; }
    if (idx === innings.lastBowlerIdx) { disabled = 'disabled'; note = ' (just bowled)'; }
    html += '<button class="bowler-option" ' + disabled + ' onclick="FC.selectBowler(' + idx + ')">' +
      p.name + '<span class="bo-overs">' + bc.overs + '/' + MAX_BOWLER_OVERS + ' ov' + note + '</span></button>';
  });
  // Bowler usage warning
  var bowlersUsed = innings.bowlingCard.filter(function(b) { return b.overs > 0 || b.balls > 0; }).length;
  if (bowlersUsed < 4 && oversLeft <= (4 - bowlersUsed)) {
    html += '<p class="text-warning small mt-2"><i class="bi bi-exclamation-triangle me-1"></i>Must use at least 4 bowlers! ' + bowlersUsed + '/4 used so far.</p>';
  }
  document.getElementById('bowlerModalBody').innerHTML = html;
  var modal = new bootstrap.Modal(document.getElementById('bowlerModal'));
  modal.show();
}

function selectBowler(idx) {
  innings.currentBowlerIdx = idx;
  innings.bowlingCard[idx].didBowl = true;
  bootstrap.Modal.getInstance(document.getElementById('bowlerModal')).hide();
  renderScoring();
  showScreen('screenScoring');
}


/* Part 4: Innings Break, Results, NRR, Undo */
function showInningsBreak() {
  var inn1 = match.innings[0];
  document.getElementById('breakScore').textContent = inn1.battingTeam + ': ' + inn1.totalRuns + '/' + inn1.totalWickets;
  document.getElementById('breakOvers').textContent = '(' + getOversDisplay(inn1.legalBalls) + ' overs)';
  var target = inn1.totalRuns + 1;
  document.getElementById('breakTarget').innerHTML = '<i class="bi bi-bullseye me-2"></i>Target: <strong>' + target + ' runs</strong> in 6 overs';
  // Scorecard summary
  var html = '<h6 class="text-gold small fw-bold mb-2">Batting Summary</h6><table class="scorecard-table"><thead><tr><th>Batter</th><th>R</th><th>B</th><th>4s</th><th>6s</th><th></th></tr></thead><tbody>';
  inn1.battingCard.forEach(function(b) {
    if (b.didNotBat) return;
    var cls = b.isOut ? 'dismissed' : 'not-out';
    html += '<tr class="' + cls + '"><td>' + b.name + '</td><td>' + b.runs + '</td><td>' + b.balls + '</td><td>' + b.fours + '</td><td>' + b.sixes + '</td><td class="small">' + (b.isOut ? b.dismissal : 'not out') + '</td></tr>';
  });
  html += '</tbody></table><p class="small text-white-50 mt-1 mb-0">Extras: ' + inn1.extras.total + ' (Wd:' + inn1.extras.wides + ' NB:' + inn1.extras.noBalls + ' B:' + inn1.extras.byes + ' LB:' + inn1.extras.legByes + ')</p>';
  document.getElementById('breakScorecard').innerHTML = html;
  // 2nd innings batting inputs
  var bowlingTeam2 = match.battingFirst === match.teams.home.name ? match.teams.away : match.teams.home;
  document.getElementById('innings2BattingLabel').textContent = '🏏 ' + bowlingTeam2.name + ' (Batting)';
  var inputsHtml = '';
  bowlingTeam2.players.forEach(function(p, i) {
    inputsHtml += '<input type="text" class="player-input" id="inn2Bat' + (i+1) + '" value="' + p.name + '" placeholder="Batsman ' + (i+1) + '">';
  });
  document.getElementById('innings2BattingInputs').innerHTML = inputsHtml;
  showScreen('screenBreak');
}

function startInnings2() {
  var inn1 = match.innings[0];
  var target = inn1.totalRuns + 1;
  // Get batting team (the team that bowled first)
  var battingTeamName, bowlingTeamName, batPlayers, bowlPlayers;
  if (match.battingFirst === match.teams.home.name) {
    battingTeamName = match.teams.away.name;
    bowlingTeamName = match.teams.home.name;
    bowlPlayers = match.teams.home.players;
  } else {
    battingTeamName = match.teams.home.name;
    bowlingTeamName = match.teams.away.name;
    bowlPlayers = match.teams.away.players;
  }
  // Read updated batting order
  batPlayers = [];
  for (var i = 1; i <= PLAYERS_PER_SIDE; i++) {
    var n = document.getElementById('inn2Bat' + i).value.trim() || ('Batsman ' + i);
    batPlayers.push({ id: i, name: n });
  }
  match.status = 'innings2';
  innings = createInnings(2, battingTeamName, bowlingTeamName, batPlayers, bowlPlayers, target);
  match.innings[1] = innings;
  undoStack = [];
  saveMatch();
  showBowlerSelection();
}

function calculateResult() {
  var inn1 = match.innings[0];
  var inn2 = match.innings[1];
  var result = {};
  if (inn2.totalRuns >= inn2.target) {
    // Batting second won
    result.winner = inn2.battingTeam;
    result.loser = inn1.battingTeam;
    result.margin = { type: 'wickets', value: MAX_WICKETS - inn2.totalWickets };
    result.resultString = result.winner + ' won by ' + result.margin.value + ' wicket' + (result.margin.value !== 1 ? 's' : '');
  } else if (inn2.totalRuns === inn1.totalRuns) {
    result.winner = null;
    result.isTie = true;
    result.resultString = 'Match Tied!';
  } else {
    // Batting first won
    result.winner = inn1.battingTeam;
    result.loser = inn2.battingTeam;
    result.margin = { type: 'runs', value: inn1.totalRuns - inn2.totalRuns };
    result.resultString = result.winner + ' won by ' + result.margin.value + ' run' + (result.margin.value !== 1 ? 's' : '');
  }
  // Points
  result.pointsAwarded = {};
  if (result.isTie) {
    result.pointsAwarded[inn1.battingTeam] = 1;
    result.pointsAwarded[inn2.battingTeam] = 1;
  } else if (result.winner) {
    result.pointsAwarded[result.winner] = 2;
    result.pointsAwarded[result.loser] = 0;
  }
  match.result = result;
  // NRR
  match.nrr = calculateNRR(inn1, inn2);
  localStorage.removeItem('fc2026_active_match');
}

function calculateNRR(inn1, inn2) {
  var nrr = {};
  var team1 = inn1.battingTeam;
  var team2 = inn2.battingTeam;
  // Team 1 NRR
  var t1oversFaced = inn1.totalWickets >= MAX_WICKETS ? MAX_OVERS : inn1.legalBalls / 6;
  var t1oversBowled = inn2.totalWickets >= MAX_WICKETS ? MAX_OVERS : inn2.legalBalls / 6;
  nrr[team1] = {
    runsScored: inn1.totalRuns, oversFaced: t1oversFaced,
    runsConceded: inn2.totalRuns, oversBowled: t1oversBowled,
    nrr: t1oversFaced > 0 && t1oversBowled > 0 ? ((inn1.totalRuns / t1oversFaced) - (inn2.totalRuns / t1oversBowled)).toFixed(3) : '0.000'
  };
  // Team 2 NRR
  var t2oversFaced = inn2.totalWickets >= MAX_WICKETS ? MAX_OVERS : inn2.legalBalls / 6;
  var t2oversBowled = inn1.totalWickets >= MAX_WICKETS ? MAX_OVERS : inn1.legalBalls / 6;
  nrr[team2] = {
    runsScored: inn2.totalRuns, oversFaced: t2oversFaced,
    runsConceded: inn1.totalRuns, oversBowled: t2oversBowled,
    nrr: t2oversFaced > 0 && t2oversBowled > 0 ? ((inn2.totalRuns / t2oversFaced) - (inn1.totalRuns / t2oversBowled)).toFixed(3) : '0.000'
  };
  return nrr;
}

function undoLast() {
  if (undoStack.length < 2) { alert('Nothing to undo'); return; }
  undoStack.pop(); // remove current
  var prev = undoStack[undoStack.length - 1];
  if (prev) {
    // Restore innings state
    var keys = Object.keys(prev);
    keys.forEach(function(k) { innings[k] = JSON.parse(JSON.stringify(prev[k])); });
    if (match.status === 'innings1') match.innings[0] = innings;
    else match.innings[1] = innings;
    saveMatch();
    renderScoring();
  }
}

function showResult() {
  document.getElementById('resultString').textContent = match.result.resultString;
  var html = '';
  // Both innings scorecards
  for (var i = 0; i < 2; i++) {
    var inn = match.innings[i];
    if (!inn) continue;
    html += '<h6 class="text-gold fw-bold mb-2 mt-3">' + inn.battingTeam + ' — ' + inn.totalRuns + '/' + inn.totalWickets + ' (' + getOversDisplay(inn.legalBalls) + ' ov)</h6>';
    html += '<table class="scorecard-table mb-2"><thead><tr><th>Batter</th><th>R</th><th>B</th><th>4s</th><th>6s</th><th></th></tr></thead><tbody>';
    inn.battingCard.forEach(function(b) {
      if (b.didNotBat) { html += '<tr><td colspan="6" class="text-white-50 small">' + b.name + ' — DNB</td></tr>'; return; }
      html += '<tr><td>' + b.name + '</td><td class="fw-bold">' + b.runs + '</td><td>' + b.balls + '</td><td>' + b.fours + '</td><td>' + b.sixes + '</td><td class="small text-white-50">' + (b.isOut ? b.dismissal : 'not out') + '</td></tr>';
    });
    html += '</tbody></table>';
    html += '<p class="small text-white-50 mb-1">Extras: ' + inn.extras.total + ' (Wd:' + inn.extras.wides + ' NB:' + inn.extras.noBalls + ' B:' + inn.extras.byes + ' LB:' + inn.extras.legByes + ')</p>';
    // Bowling
    html += '<table class="scorecard-table mb-2"><thead><tr><th>Bowler</th><th>O</th><th>R</th><th>W</th><th>Eco</th></tr></thead><tbody>';
    inn.bowlingCard.forEach(function(bw) {
      if (bw.balls === 0) return;
      var eco = bw.balls > 0 ? (bw.runs / (bw.balls / 6)).toFixed(1) : '0.0';
      html += '<tr><td>' + bw.name + '</td><td>' + getOversDisplay(bw.balls) + '</td><td>' + bw.runs + '</td><td>' + bw.wickets + '</td><td>' + eco + '</td></tr>';
    });
    html += '</tbody></table>';
  }
  // NRR info
  if (match.nrr) {
    html += '<h6 class="text-info small fw-bold mt-3">NRR Impact</h6>';
    Object.keys(match.nrr).forEach(function(team) {
      html += '<p class="small text-white-50 mb-0">' + team + ': ' + match.nrr[team].nrr + '</p>';
    });
  }
  document.getElementById('fullScorecard').innerHTML = html;
  showScreen('screenResult');
}

function shareResult() {
  if (!match || !match.result) return;
  var text = '🏆 Freedom Cup 2026 | ' + match.round + '\n';
  text += match.teams.home.name + ' vs ' + match.teams.away.name + '\n';
  text += match.result.resultString + '\n';
  text += match.innings[0].battingTeam + ': ' + match.innings[0].totalRuns + '/' + match.innings[0].totalWickets + ' (' + getOversDisplay(match.innings[0].legalBalls) + ')\n';
  if (match.innings[1]) text += match.innings[1].battingTeam + ': ' + match.innings[1].totalRuns + '/' + match.innings[1].totalWickets + ' (' + getOversDisplay(match.innings[1].legalBalls) + ')\n';
  text += '#FreedomCup2026 🇺🇸🏏';
  if (navigator.share) {
    navigator.share({ title: 'Freedom Cup 2026', text: text }).catch(function(){});
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(function() { alert('Result copied to clipboard!'); });
  } else {
    prompt('Copy this result:', text);
  }
}

function newMatch() {
  match = null;
  innings = null;
  undoStack = [];
  showScreen('screenSetup');
  showPreviousMatches();
}


/* Part 5: Rendering & UI Updates */
function renderScoring() {
  if (!innings) return;
  // Header
  var targetHtml = '';
  if (innings.target) {
    var need = innings.target - innings.totalRuns;
    var rrr = getRRR();
    targetHtml = '<div class="score-target">Need ' + need + ' off ' + ((MAX_OVERS * 6) - innings.legalBalls) + ' balls' + (rrr ? ' | RRR: ' + rrr : '') + '</div>';
  }
  document.getElementById('scoringHeader').innerHTML =
    '<div class="d-flex justify-content-between align-items-center">' +
    '<div><div class="score-display">' + innings.battingTeam + '</div><div class="score-overs">' + innings.totalRuns + '/' + innings.totalWickets + ' (' + getOversDisplay(innings.legalBalls) + ' ov)</div></div>' +
    '<div class="text-end"><div class="score-crr">CRR: ' + getCRR() + '</div>' + targetHtml + '</div></div>';
  // Batsmen
  var strikerCard = innings.battingCard[innings.striker];
  var nonStrikerCard = innings.battingCard[innings.nonStriker];
  document.getElementById('batsmenPanel').innerHTML =
    '<div class="batsman-row striker"><span class="batsman-name">★ ' + strikerCard.name + '</span><span class="batsman-stats">' + strikerCard.runs + ' (' + strikerCard.balls + ') ' + (strikerCard.fours > 0 ? '<span class="text-success">' + strikerCard.fours + '×4</span> ' : '') + (strikerCard.sixes > 0 ? '<span style="color:#d98fff">' + strikerCard.sixes + '×6</span>' : '') + '</span></div>' +
    '<div class="batsman-row"><span class="batsman-name">' + nonStrikerCard.name + '</span><span class="batsman-stats">' + nonStrikerCard.runs + ' (' + nonStrikerCard.balls + ')</span></div>';
  // Bowler
  if (innings.currentBowlerIdx >= 0) {
    var bwc = innings.bowlingCard[innings.currentBowlerIdx];
    var bowlBalls = bwc.balls;
    var bowlOvers = getOversDisplay(bowlBalls);
    document.getElementById('bowlerPanel').innerHTML =
      '<div class="bowler-info"><span class="bowler-name"><i class="bi bi-circle-fill me-1" style="font-size:0.5rem"></i>' + bwc.name + '</span><span class="bowler-figures">' + bowlOvers + ' - ' + bwc.maidens + ' - ' + bwc.runs + ' - ' + bwc.wickets + '</span></div>';
  }
  // This Over
  var overHtml = '<div class="d-flex align-items-center gap-2"><span class="small text-white-50">This Over:</span><div class="over-balls">';
  innings.overBalls.forEach(function(b) {
    var cls = 'ball-run';
    if (b.type === 'dot') cls = 'ball-dot';
    else if (b.type === 'four') cls = 'ball-four';
    else if (b.type === 'six') cls = 'ball-six';
    else if (b.type === 'wicket') cls = 'ball-wicket';
    else if (b.type === 'wide') cls = 'ball-wide';
    else if (b.type === 'noball') cls = 'ball-noball';
    else if (b.type === 'bye') cls = 'ball-bye';
    overHtml += '<span class="ball-token ' + cls + '">' + b.display + '</span>';
  });
  overHtml += '</div></div>';
  document.getElementById('thisOverPanel').innerHTML = overHtml;
  // Free Hit banner
  var fhBanner = document.getElementById('freeHitBanner');
  if (innings.isFreeHit) { fhBanner.classList.remove('d-none'); } else { fhBanner.classList.add('d-none'); }
  // Over Summary
  var sumHtml = '<p class="small text-white-50 mb-1">Overs Bowled:</p><div>';
  innings.overs.forEach(function(o) {
    var balls = o.balls.map(function(b) { return b.display; }).join(' ');
    sumHtml += '<span class="over-summary-item">' + o.overNum + '. ' + o.bowler + ': ' + balls + '</span> ';
  });
  // Show bowlers usage
  var bowlersUsed = innings.bowlingCard.filter(function(b) { return b.overs > 0 || b.balls > 0; }).length;
  sumHtml += '</div><p class="small text-white-50 mt-1 mb-0">Bowlers used: ' + bowlersUsed + '/4 required</p>';
  document.getElementById('overSummaryPanel').innerHTML = sumHtml;
  showScreen('screenScoring');
}

// Public API
return {
  init: init,
  showScreen: showScreen,
  setupNext: setupNext,
  startMatch: startMatch,
  resumeMatch: resumeMatch,
  abandonResume: abandonResume,
  scoreRuns: scoreRuns,
  scoreWide: scoreWide,
  scoreNoBall: scoreNoBall,
  scoreBye: scoreBye,
  scoreLegBye: scoreLegBye,
  scoreWicket: scoreWicket,
  confirmWicket: confirmWicket,
  wktTypeChange: wktTypeChange,
  selectBowler: selectBowler,
  closeRunsModal: closeRunsModal,
  undoLast: undoLast,
  startInnings2: startInnings2,
  shareResult: shareResult,
  newMatch: newMatch
};
})();

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', FC.init);
