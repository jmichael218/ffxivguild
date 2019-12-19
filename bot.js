const Discord = require('discord.js');
const client = new Discord.Client();
//var auth = require('./auth.json');

client.on('ready', () => {
  console.log('system ready!');
	//randomSmae();
});

// Create an event listener for messages
client.on('message', msgObj => {

	var msg = msgObj.content;
	if (msg.substring(0,1) != '!') {
		return;
		//msgObj.channel.send('get cmd');
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

		case 'add':
			//addMember(args, msgObj);
			break;


		default:
	}

});

//client.login(auth.token);
client.login(process.env.BOT_TOKEN);


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

	// console.log('TankList:');
	// tList.forEach(function(mb){
	// 	console.log(mb.MemberName);
	// });
	//
	//
	// console.log('HealerList:');
	// hList.forEach(function(mb){
	// 	console.log(mb.MemberName);
	// });
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
