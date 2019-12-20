const Discord = require('discord.js');
const client = new Discord.Client();
var debugMode = false;

client.on('ready', () => {
  console.log('system ready!');
});

// Create an event listener for messages
client.on('message', msgObj => {

	var msg = msgObj.content;
	if (msg.substring(0,1) != '!') {
		return;
	}

	var args = msg.substring(1).split(' ');
	var cmd  = args[0];
	args = args.splice(1);

	console.log('cmd: ' + cmd + ', args: ' + args);
	console.log('arglength: ' + args.length);

	switch (cmd) {
		case 'show':
				showAllMember(msgObj);
			break;

    case 'who':
        showMemberInfo(msgObj, args, false);
      break;

    case 'more':
        showMemberInfo(msgObj, args, true);
      break;

    case 'r':
        var isOK = checkMembers(args);

        if (!isOK) {
          var msg = '輸入的人數或人名有誤, 請檢查輸入的人名不重複且已存在於清單中.\n可透過輸入 !show 來顯示目前清單中所有人名喔.'
          msgObj.channel.send(msg);
          break;
        }

        randomMembers(msgObj, args);
      break;

		case 'rt':

        var testData = ["水漾年華","沐非煙","阿爾庫塔斯","葉落散華","工口魔王","白井多惠","瀰","安筠"];
        msgObj.channel.send('---------------------------------------------------------------------------------');
        msgObj.channel.send('使用測試資料進行 隨機職業挑選, 測試資料如下: ');
        msgObj.channel.send('水漾年華 沐非煙 阿爾庫塔斯 葉落散華 工口魔王 白井多惠 瀰 安筠');
        msgObj.channel.send('---------------------------------------------------------------------------------');
        randomMembers(msgObj, testData);
        msgObj.channel.send('---------------------------------------------------------------------------------');
			break;

		default:
	}

});

if (debugMode) {
  var auth = require('./auth.json');
  client.login(auth.token);
} else {
  client.login(process.env.BOT_TOKEN);
}

// Who: Show MemberInfos --------------------------------------
function showMemberInfo(msgObj, name, isSHowClass) {
  var mList = getLastUpdatedMembers();
  var who = null;

  mList.forEach(function(mb){
    if (mb.MemberName == name) {
      who = mb;
    }
  });

  if (who == null) {

    msgObj.channel.send(name + '-> 沒有這個人呢');
    return;
  }

  var note = who.Note == '' ? '目前沒有自我介紹喔～' : who.Note;
  msgObj.channel.send(name + "\t->\t" + note);

  if (isSHowClass) {
    who.Classes.forEach(function(cl){
        msgObj.channel.send("職業:\t" + cl.Name);
    });
  }
}

// Random Members ---------------------------------------------
function checkMembers(memberNames) {
  const correct = 8;
  var result = Array.from(new Set(memberNames));

  if (memberNames.length != correct || result.length != correct) {
    return false;
  }

  var count = 0;
  var mList = getLastUpdatedMembers();
  memberNames.forEach(function(name){

    mList.forEach(function(mb){

      if (name == mb.MemberName){
        count ++;
      }
    });
  });

  return count == correct ? true : false
}

function randomMembers(msgObj, memberNames){

  var members = getMemberByNames(memberNames);

	//get tank list
	var tList = getMembersByType('T', members);
	var hList = getMembersByType('H', members);
  var dList = getMembersByType('D', members);

  var t1Pos = Math.floor(Math.random() * tList.length);
	var t1 = tList[t1Pos];
  tList.splice(t1Pos, 1);
	var t2 = tList[Math.floor(Math.random() * tList.length)];
  var tMbs = [t1,t2];

  tMbs.forEach(function(tank){
    for (var i = 0; i < hList.length; i++) {
      var hMember = hList[i];
      //console.log(' compare :'+tank.MemberName+', ' + hMember.MemberName);
      if (tank.MemberName == hMember.MemberName) {

        console.log(' - remove : ' + hMember.MemberName);
        hList.splice(i, 1);
      }
    }
  });

  // 安筠 特殊狀況, 只有一補 若有出現, 直接塞入 h1
  var h1Pos = -1;
  var spName = "安筠"
  hList.forEach(function(mb, index, array){
    if (mb.MemberName == spName){
      h1Pos = index;
    }
  });

  if (h1Pos == -1) {
    h1Pos = Math.floor(Math.random() * hList.length);
  }

  var h1 = hList[h1Pos];
  hList.splice(h1Pos, 1);
  var h2 = hList[Math.floor(Math.random() * hList.length)];
  var mbs = [h1, h2, t1, t2];

  mbs.forEach(function(member){
    for (var i = 0; i < dList.length; i++) {
      var dMember = dList[i];

      if (member.MemberName == dMember.MemberName) {
        dList.splice(i, 1);
      }
    }
  });

  var dispT1 = '坦克:\t' + t1.MemberName + '\t' + getTypeByRandomClosses('T', t1.Classes) + '\n';
  var dispT2 = '坦克:\t' + t2.MemberName + '\t' + getTypeByRandomClosses('T', t2.Classes) + '\n';
  var dispH1 = '奶媽:\t' + h1.MemberName + '\t' + getTypeByRandomClosses('H', h1.Classes) + '\n';
  var dispH2 = '奶媽:\t' + h2.MemberName + '\t' + getTypeByRandomClosses('H', h1.Classes) + '\n';
  var dps = '';

  dList.forEach(function(mb){
	   dps += '輸出\t: ' + mb.MemberName + '\t' + getTypeByRandomClosses('D', mb.Classes) + '\n';
	});

  var result = [dispT1, dispT2, dispH1, dispH2, dps];
  result.forEach(function(msg){

    msgObj.channel.send(msg);
  });
}

function getMembersByType(typeName, members) {

	var mList = [];
	members.forEach(function(mb){

		var hasAdded = false;
		mb.Classes.forEach(function(cl){

			if (cl.Type == typeName && !hasAdded) {
				mList.push(mb);
				hasAdded = true;
			}
		});
	});

	return mList;
}

function getTypeByRandomClosses(typeName, clsList) {

  // 透過列表職業名稱 取出 Type 坦,奶,輸出 後 隨機取一個出來
  var cls = []

  clsList.forEach(function(clsInfo){

    if (clsInfo.Type == typeName) {
      cls.push(clsInfo);
    }
  });

  var cl = cls[Math.floor(Math.random() * cls.length)];
  return cl.Name;
}

// API funcs -------------------------------------------------
function addMember(args, msgObj) {

	if (args.length != 2) {
		msgObj.channel.send('參數數量不正確');
		return;
	}
	// 先檢查是否有相同職業跟姓名
	console.log('Start to Add Member .....');
	var isExist = checkExistMemberClass(args[0],args[1])
	if (isExist) {
		msgObj.channel.send('成員職業已存在');
	}

	var members = getLastUpdatedMembers()

}

function showAllMember(msgObj) {

	var members = getLastUpdatedMembers();
	var result = '';

	members.forEach(function(mb){

		var name = mb.MemberName;
		var cls = mb.Classes;

		result += mb.MemberName + '\n';
		//message.channel.send(name);

		cls.forEach(function(cl){
			var clType = cl.Type;
			var clName = cl.Name;

			result += ' - ' + clType + ', ' + clName + '\n';
			//message.channel.send();
		});
	});

	msgObj.channel.send(result);
}

// Utils -
function checkCorrectClasses(className) {
	// 檢查職業名稱 並轉換 出 統一名稱
}

function checkExistMemberClass(name, className, members) {

	var isExist = false;
	var members = getLastUpdatedMembers();
	members.forEach(function(mb){

		if (mb.MemberName != name)
			return;

		mb.Classes.forEach(function(cl){

			if (cl.Name == className) {
				isExist = ture;
				break;
			}
		});
	});

	return isExist;
}

function getLastUpdatedMembers() {
	return members = require('./members.json');
}

function getMemberByNames(nameList) {
  var allMembers    = require('./members.json');
  var targetMameber = []

  nameList.forEach(function(name){
    console.log(name);
    allMembers.forEach(function(mb){
      if (mb.MemberName == name) {
        targetMameber.push(mb);
      }
    });
  });

  return targetMameber;
}
