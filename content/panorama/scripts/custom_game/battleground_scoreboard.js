"use strict";

(function()	{
	FindDotaHudElement("ToggleScoreboardButton").style.visibility = 'collapse';
	GameEvents.Subscribe("battleground_show_scoreboard", ShowBattlegroundScoreboard);
	CustomNetTables.SubscribeNetTableListener("battleground_scoreboard", UpdateBattlegroundScoreboard);

	var shop_button = FindDotaHudElement("ShopButton");
	$.RegisterEventHandler("DOTAHUDToggleShop", shop_button, ToggleScoreboardVisibility);
})();

function ShowBattlegroundScoreboard() {
	$("#BGScore").style.visibility = 'visible';
}

function UpdateBattlegroundScoreboard(keys) {

	FindDotaHudElement("ToggleScoreboardButton").style.visibility = 'collapse';
	var data = CustomNetTables.GetTableValue(keys, "scoreboard");

	for (var i = 1; i <= 24; i++) {
		if (data[i].hero) {
			$('#BGScoreRow' + i).style.visibility = 'visible'
			$('#BGScoreLabel' + i).text = data[i].score
			$('#BGScoreHero' + i).heroname = data[i].hero

			if (data[i].abandoned) {
				$('#BGScoreHero' + i).RemoveClass("disconnected")
				$('#BGScoreHero' + i).AddClass("abandoned")
			} else if (data[i].disconnected) {
				$('#BGScoreHero' + i).AddClass("disconnected")
			} else {
				$('#BGScoreHero' + i).RemoveClass("disconnected")
				$('#BGScoreHero' + i).RemoveClass("abandoned")
			}
		} else {
			$('#BGScoreRow' + i).style.visibility = 'collapse'
		}
	}
}

function ToggleScoreboardVisibility() {
	if (Game.GetDOTATime(false, true) > 0) {
		if ($("#BGScore").style.visibility == 'visible') {
			$("#BGScore").style.visibility = 'collapse';
		} else {
			$("#BGScore").style.visibility = 'visible';
		}
	}
}

// Utility functions
function FindDotaHudElement (id) {
	return GetDotaHud().FindChildTraverse(id);
}

function GetDotaHud () {
	var p = $.GetContextPanel();
	while (p !== null && p.id !== 'Hud') {
		p = p.GetParent();
	}
	if (p === null) {
		throw new HudNotFoundException('Could not find Hud root as parent of panel with id: ' + $.GetContextPanel().id);
	} else {
		return p;
	}
}