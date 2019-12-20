const Discord = require('discord.js');
const client = new Discord.Client();
var debugMode = true

client.on('ready', () => {
  console.log('system ready!');
	//randomSample();
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

		case 'random':
        var testData = ["水漾年華","沐非煙","阿爾庫塔斯","葉落散華","工口魔王","白井多惠","瀰","安筠"];
        randomSample(msgObj, testData);
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

function showListType(list, type) {

  list.forEach(function(mb){
    console.log(mb.MemberName + ' - ' + type);
  });
  console.log('-----------------');
}

function randomSample(msgObj, ){
	//console.log('system ready!');
  console.log('random sample ==============')
  var testData = ["水漾年華","沐非煙","阿爾庫塔斯","葉落散華","工口魔王","白井多惠","瀰","安筠"];
  var members = getMemberByNames(testData);

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
      console.log(' >>>>> get sp member with idx: ' + index);
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

  var dispT1 = '坦: ' + t1.MemberName + '\n';
  var dispT2 = '坦: ' + t2.MemberName + '\n';
  var dispH1 = '補: ' + h1.MemberName + '\n';
  var dispH2 = '補: ' + h2.MemberName + '\n';
  var dps = '輸出: ' + '\n';
  dList.forEach(function(mb){
	   dps += mb.MemberName + '\n';
	});

  var result = [dispT1, dispT2, dispH1, dispH2, dps];
  result.forEach(function(msg){

    msgObj.channel.send(msg);
  });
}

// Random Sample ---------------------------------------------
function randomSmae(){
	//console.log('system ready!');
	var members = getLastUpdatedMembers();

	//get tank list
	var tList = getMembersByType('T', members);
	var hList = getMembersByType('H', members);

	var t1 = tList[Math.floor(Math.random() * tList.length)];
	var t2 = tList[Math.floor(Math.random() * tList.length)];

	console.log('get two tank:');
	console.log(t1.MemberName);
	console.log(t2.MemberName);
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

function removeMember(Name) {

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

function getTypeByClosses(className) {
	// 透過列表職業名稱 取出 Type 坦,奶,輸出
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
        console.log('  --> push: ' + mb.MemberName);
      }
    });
  });

  return targetMameber;
}
