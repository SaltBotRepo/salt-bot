const Discord = require("discord.js");
const PREFIX = "="
const TOKEN = "NDI1MzgyMjMzNzM4NzA2OTQ0.DaA7wQ.ldaTIANvAFV2az1rpXsGFh9PCf4";
const YTDL = require("ytdl-core");

function play(connection, message) {
    var server = servers[message.guild.id];

    server.dispatcher = connection.playStream(YTDL(server.queue[0], {filter: "audioonly"}));

    server.queue.shift();

    server.dispatcher.on("end", function() {
        if (server.queue[0]) play(connection, message);
        else connection.disconnect();
    });
}


var bot = new Discord.Client();

var servers = {};

bot.on("ready", function() {
    console.log("Ready")
});

bot.on("message", function(message) {

    if(message.content.indexOf("@someone") != -1) {
        message.delete();
        message.channel.send("Stop it.. Get some help!")
            .then(message => {
                message.delete(3000)
            });
    }
    if (message.author.equals(bot.user)) return;
    
    if (!message.content.startsWith(PREFIX)) return;

    if(message.channel.type != ("text")) return;
    var bcmds = message.guild.channels.find("name","bot-commands");
    var musicchan = message.guild.channels.find("name","music-requests");
    
    var args = message.content.substring(PREFIX.length).split(" ");

    switch (args[0].toLowerCase()) {
        case "owner":
            message.delete();
            message.channel.send("My Creator is @Paint#5464")
                .then(message => {
                    message.delete(5000)
                });
            break;
        case "botinfo":
            if(message.channel != bcmds && !message.member.roles.find("name", "Owner")){
                message.delete();
                return message.channel.send("Please use " + bcmds + " for bot commands (Except Report And Suggest)")
                    .then(message => {
                    message.delete(5000)
                });
            }
            
            let bicon = bot.user.displayAvatarURL;
            let botembed = new Discord.RichEmbed()
            .setDescription("Bot Information")
            .setColor("#3478e5")
            .setThumbnail(bicon)
            .addField("Bot Name", bot.user.username)
            .addField("Created On", bot.user.createdAt);
            return message.channel.send(botembed);
            message.delete();
            break;
        case "help":
            if(message.channel != bcmds && !message.member.roles.find("name", "Owner")){
                message.delete();
                return message.channel.send("Please use " + bcmds + " for bot commands (Except Report And Suggest)")
                    .then(message => {
                    message.delete(5000)
                });
            }
            message.channel.send("Here You Go" + message.author.toString() + "I messaged you a list of all the commands!")
                .then(message => {
                    message.delete(10000)
            });
            // message.channel.send("This command is currently under development :)");
            var helpembed = new Discord.RichEmbed()
                .addField("Main", "Commands")
                .addField("=botinfo", "Shows the info of the bot")
                .addField("=report [@User] [Reason]", "Reports a user for a reason")
                .addField("=serverinfo", "Shows the info of the server")
                .addField("=time [@User]", "Shows you when a member joined the discord")
                .addField("=suggest [Suggestion]", "Suggest a feature to the discord")
                .addField("=leaderboard", "Shows the top fortnite players on the server")
                .addField("=help", "Shows this command")
                .addBlankField()
                .addField("Music", "Commands")
                .addField("=play [url]", "Play a song from youtube using a url")
                .addField("=skip", "Skip a song")
                .addField("=stop", "Stops the music")
                .addField("=lose", "Plays a sad song")
                .addField("=battle", "Plays intense music")
                .addField("=win", "Plays happy music")
                .addField("=kill", "Plays mlg kill music")
                .addField("=mememusic", "Plays... Mememusic")
                .addField("=rsong", "Plays a random song from our collection")
                .addBlankField()
                .addField("Social","Commands")
                .addField("=youtube", "Tells you our youtube")
                .addField("=twitch", "Tells you our twitch")
                .setColor("#4286f4")
                .setThumbnail(message.author.avatarURL);
            message.author.send(helpembed);
            message.delete();
            break;
        case "promote":
            // let correctchan = message.guild.channels.find("name","bot-commands");
            // if(message.channel != correctchan) {
            //     message.delete();
            //     return;
            // }
            //let ownerRole = message.guild.roles.find("id" , "429705328406429699");
            //message.channel.send(ownerRole);
            if(!message.member.roles.find("name", "Owner") && !message.member.roles.find("name", "🕵️Staff Manager")) {
                message.delete();
                return;
            }
            let member = message.mentions.members.first();
            if (member == null) {
                message.delete();
                return message.channel.send("Please enter a user to promote!")
                    .then(message => {
                    message.delete(5000)
                });
            }
            let newrole = message.mentions.roles.first();
            if (newrole == null) {
                message.delete();
                return message.channel.send("Please enter a role to promote the user to!")
                    .then(message => {
                    message.delete(5000)
                });
            }
            let prefix = args.slice(3).join(" ");
            if (prefix == "") {
                message.delete();
                return message.channel.send("Please enter a prefix to give the user!")
                    .then(message => {
                    message.delete(5000)
                });
            }
            message.channel.send(newrole);
            member.addRole(newrole).catch(console.error());
            let chan = message.guild.channels.find("name", "announcements");
            chan.send("@everyone Congratulations To " + member + " On " + newrole);
            let currentname = member.user.username;
            member.setNickname(prefix + " | " + currentname);
            member.send("Congratulations " +member+ " on " +prefix+ ". Your name on the server is now " + prefix + " | "+ member.displayName);
            message.delete();
            break;
        case "report":
            let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
            if(!rUser) return message.channel.send("Player Offline Or Doesn't Exist");
            let reason = args.slice(2).join(" ");
            if (reason == "") {
                message.delete();
                return message.channel.send("Please enter a reason for your report")
                    .then(message => {
                    message.delete(5000)
                });
            }
        
            let reportEmbed = new Discord.RichEmbed()
            .setDescription("Report")
            .setColor("#3478e5")
            .addField("Reported User", `${rUser} with ID: ${rUser.id}`)
            .addField("Reported By", `${message.author} with ID: ${message.author.id}`)
            //.addField("Channel", message.channel)
            .addField("Time", message.createdAt)
            .addField("Reason", reason);
        
            let reportschannel = message.guild.channels.find(`name`, "reports");
            if (!reportschannel) {
                message.delete();
                return message.channel.send("Couldn't Find Reports Channel.")
                    .then(message => {
                        message.delete(5000)
                    });
            }
            if (message.channel != reportschannel){
                message.delete();
                 return message.channel.send("Please Make Reports In The " + reportschannel + " Channel.")
                    .then(message => {
                        message.delete(5000)
                    });
                }
            
        
            message.delete().catch(O_o=>{});
            let adreports = message.guild.channels.find("name", "admin-reports");
            adreports.send(reportEmbed);
            message.channel.send("Ok " + message.author + ". " + "Report Made.", {tts:false});
            message.delete();
            break;
        case "serverinfo":
            if(message.channel != bcmds && !message.member.roles.find("name", "Owner")){
                message.delete();
                return message.channel.send("Please use " + bcmds + " for bot commands (Except Report And Suggest)")
                    .then(message => {
                    message.delete(5000)
                });
            }
            let sicon = message.guild.iconURL;
            let serverembed = new Discord.RichEmbed()
            .setDescription("Server Information")
            .setColor("#3478e5")
            .setThumbnail(sicon)
            .addField("Server name", message.guild.name , true)
            .addField("Server Region", message.guild.region, true)
            .addField("Created On", message.guild.createdAt)
            .addField("You Joined", message.member.joinedAt)
            .addField("Total Members", message.guild.memberCount);
        
            message.delete().catch(O_o=>{});
            message.channel.send(serverembed);
            message.delete();
            break;
        case "time":
            if(message.channel != bcmds && !message.member.roles.find("name", "Owner")){
                message.delete();
                return message.channel.send("Please use " + bcmds + " for bot commands (Except Report And Suggest)")
                    .then(message => {
                    message.delete(5000)
                });
            }
            let JoinedAtMember = message.mentions.members.first();
            if (JoinedAtMember == null) {
                message.delete();
                return message.channel.send("Please enter a username")
                    .then(message => {
                    message.delete(5000)
                });
            }
            message.channel.send(JoinedAtMember + " Has been a part of the community since " + JoinedAtMember.joinedAt)
                .then(message => {
                    message.delete(30000)
                });
            message.delete();
            break;
        case "suggest":
            let suggestion = args.slice(1).join(" ");
            if (suggestion == "") {
                message.delete();
                return message.channel.send("Please enter a suggestion")
                    .then(message => {
                    message.delete(5000)
                });
            }
        
            let suggestionEmbed = new Discord.RichEmbed()
            //.setTitle("Suggestion")
            .setColor("#3478e5")
            .addField("Suggestion", suggestion)
            .addField("Suggested By", `${message.author} with ID: ${message.author.id}`)
            //.addField("Channel", message.channel)
            //.addField("At", message.createdAt)
        
            let suggestchannel = message.guild.channels.find(`name`, "suggestions");
            if (!suggestchannel) {
                message.delete();
                return message.channel.send("Couldn't Find Suggestions Channel.");
            }
            if (message.channel != suggestchannel) {
                message.delete();
                return message.channel.send("Please Make Suggestions In The " + suggestchannel + " Channel.");
            }
            
        
            message.delete().catch(O_o=>{});
            message.guild.member(bot.user).setNickname(message.author.username);
            suggestchannel.send(suggestionEmbed)
            .then(function (message) {
                message.react("✅")
                message.react("❌")
                });
            message.guild.member(bot.user).setNickname("[#] Salt Bot");
            //message.react("💩");
            message.delete();
            break;
        case "play":
            if(message.channel != musicchan && !message.member.roles.find("name", "Owner")){
                message.delete();
                return message.channel.send("Please use " + musicchan + " for music commands")
                    .then(message => {
                    message.delete(5000)
                });
            }
            if(!args[1]) {
                return message.channel.send("Please provide a link")
                    .then(message => {
                        message.delete(5000)
                    });
            }
            if(!message.member.voiceChannel){
                return message.channel.send("You must be in a voice channel to run this command")
                    .then(message => {
                        message.delete(5000)
                    });
            }

            if(!servers[message.guild.id]) servers[message.guild.id] = {
                queue: []
            };

            var server = servers[message.guild.id];

            server.queue.push(args[1]);

            if (!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection) {
                play(connection, message)
            });
            message.delete();
            break;
        case "skip":
            if(message.channel != musicchan && !message.member.roles.find("name", "Owner")){
                message.delete();
                return message.channel.send("Please use " + musicchan + " for music commands")
                    .then(message => {
                    message.delete(5000)
                });
            }
            var server = servers[message.guild.id];

            if(server.dispatcher) server.dispatcher.end();
            message.delete();
            break;
        case "stop":
            if(message.channel != musicchan && !message.member.roles.find("name", "Owner")){
                message.delete();
                return message.channel.send("Please use " + musicchan + " for music commands")
                    .then(message => {
                    message.delete(5000)
                });
            }
            var server = servers[message.guild.id];

            if(message.guild.voiceConnection) {
            message.guild.voiceConnection.disconnect();
            }else{
                message.channel.send("I can't leave somthing i'm not in...")
                    .then(message => {
                        message.delete(5000)
                    });
            }
            message.delete();
            break;
        case "lose":
            if(message.channel != musicchan && !message.member.roles.find("name", "Owner")){
                message.delete();
                return message.channel.send("Please use " + musicchan + " for music commands")
                    .then(message => {
                    message.delete(5000)
                });
            }
            if(!message.member.voiceChannel){
                return message.channel.send("You must be in a voice channel to run this command")
                    .then(message => {
                        message.delete(5000)
                    });
            }

            if(!servers[message.guild.id]) servers[message.guild.id] = {
                queue: []
            };

            var server = servers[message.guild.id];

            if(message.guild.voiceConnection) {
                message.guild.voiceConnection.disconnect();
            }

            server.queue.push("https://www.youtube.com/watch?v=7ODcC5z6Ca0");

            if (!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection) {
                play(connection, message)
            });
            message.delete();
            break;
        case "battle":
            if(message.channel != musicchan && !message.member.roles.find("name", "Owner")){
                message.delete();
                return message.channel.send("Please use " + musicchan + " for music commands")
                    .then(message => {
                    message.delete(5000)
                });
            }
            if(!message.member.voiceChannel){
                return message.channel.send("You must be in a voice channel to run this command")
                    .then(message => {
                        message.delete(5000)
                    });
            }

            if(!servers[message.guild.id]) servers[message.guild.id] = {
                queue: []
            };

            var server = servers[message.guild.id];

            var batsongs = ["https://www.youtube.com/watch?v=vtGKykNfs00",
                          "https://www.youtube.com/watch?v=jF64cLBgD9U",
                          "https://www.youtube.com/watch?v=lnlHNXCPuPQ",
                          "https://www.youtube.com/watch?v=aQHDBosiVMg"]

            var num = Math.floor((Math.random() * batsongs.length) + 0);


            if(message.guild.voiceConnection) {
                message.guild.voiceConnection.disconnect();
            }
            server.queue.push(batsongs[num]);

            //var num = Math.floor((Math.random() * 8) + 0);

            if (!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection) {
                play(connection, message)
            });
            message.delete();
            break;
        case "win":
            if(message.channel != musicchan && !message.member.roles.find("name", "Owner")){
                message.delete();
                return message.channel.send("Please use " + musicchan + " for music commands")
                    .then(message => {
                    message.delete(5000)
                });
            }
            if(!message.member.voiceChannel){
                return message.channel.send("You must be in a voice channel to run this command")
                    .then(message => {
                        message.delete(5000)
                    });
            }

            if(!servers[message.guild.id]) servers[message.guild.id] = {
                queue: []
            };

            var server = servers[message.guild.id];

            if(message.guild.voiceConnection) {
                message.guild.voiceConnection.disconnect();
            }

            server.queue.push("https://www.youtube.com/watch?v=GGXzlRoNtHU");

            if (!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection) {
                play(connection, message)
            });
            message.delete();
            break;
        case "kill":
            if(message.channel != musicchan && !message.member.roles.find("name", "Owner")){
                message.delete();
                return message.channel.send("Please use " + musicchan + " for music commands")
                    .then(message => {
                    message.delete(5000)
                });
            }
            if(!message.member.voiceChannel){
                return message.channel.send("You must be in a voice channel to run this command")
                    .then(message => {
                        message.delete(5000)
                    });
            }

            if(!servers[message.guild.id]) servers[message.guild.id] = {
                queue: []
            };

            var server = servers[message.guild.id];

            if(message.guild.voiceConnection) {
                message.guild.voiceConnection.disconnect();
            }


            killsong=["https://www.youtube.com/watch?v=ozuRmtWQGMU",
                      "https://www.youtube.com/watch?v=8fsH1Rp_5bk"]


            var num = Math.floor((Math.random() * killsong.length) + 0);

            server.queue.push(killsong[num]);

            if (!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection) {
                play(connection, message)
            });
            message.delete();
            break;
        case "mememusic":
            if(message.channel != musicchan && !message.member.roles.find("name", "Owner")){
                message.delete();
                return message.channel.send("Please use " + musicchan + " for music commands")
                    .then(message => {
                    message.delete(5000)
                });
            }
            if(!message.member.voiceChannel){
                return message.channel.send("You must be in a voice channel to run this command")
                    .then(message => {
                        message.delete(5000)
                    });
            }

            if(!servers[message.guild.id]) servers[message.guild.id] = {
                queue: []
            };

            var server = servers[message.guild.id];

            var rsongs = ["https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDQMWtuIZnuR5Pg",
                        "https://www.youtube.com/watch?v=K5tVbVu9Mkg&list=RDQMWtuIZnuR5Pg&index=2",
                        "https://www.youtube.com/watch?v=PfYnvDL0Qcw&list=RDQMWtuIZnuR5Pg&index=3",
                        "https://www.youtube.com/watch?v=ZZ5LpwO-An4&list=RDQMWtuIZnuR5Pg&index=6",
                        "https://www.youtube.com/watch?v=gYOEyzBFYa4&list=RDQMWtuIZnuR5Pg&index=20",
                        "https://www.youtube.com/watch?v=g-sgw9bPV4A&list=RDQMWtuIZnuR5Pg&index=8",
                        "https://www.youtube.com/watch?v=Kppx4bzfAaE&list=RDQMWtuIZnuR5Pg&index=11",
                        "https://www.youtube.com/watch?v=y6120QOlsfU&list=RDQMWtuIZnuR5Pg&index=19",
                        "https://www.youtube.com/watch?v=VfCYZ3pks48&list=RDQMWtuIZnuR5Pg&index=17"]

            var num = Math.floor((Math.random() * rsongs.length) + 0);

            message.channel.send("Now playing:\n" + `${rsongs[num]}`)
                .then(message => {
                    message.delete(10000)
                });

            if(message.guild.voiceConnection) {
                message.guild.voiceConnection.disconnect();
            }
            server.queue.push(rsongs[num]);

            //var num = Math.floor((Math.random() * 8) + 0);

            if (!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection) {
                play(connection, message)
            });
            message.delete();
            break;
        case "rsong":
            if(message.channel != musicchan && !message.member.roles.find("name", "Owner")){
                message.delete();
                return message.channel.send("Please use " + musicchan + " for music commands")
                    .then(message => {
                    message.delete(5000)
                });
            }
            if(!message.member.voiceChannel){
                return message.channel.send("You must be in a voice channel to run this command")
                    .then(message => {
                        message.delete(5000)
                    });
            }

            if(!servers[message.guild.id]) servers[message.guild.id] = {
                queue: []
            };

            var server = servers[message.guild.id];

            var rsongs = ["https://www.youtube.com/watch?v=khIh4d5KIj8",
                          "https://www.youtube.com/watch?v=2Oy5faeeS0U&list=RDMM2Oy5faeeS0U",
                          "https://www.youtube.com/watch?v=CzLsKm3sYO0",
                          "https://www.youtube.com/watch?v=oF4Drxk7Wvs&list=RDMM2Oy5faeeS0U&index=3",
                          "https://www.youtube.com/watch?v=vTCiSkJIadg",
                          "https://www.youtube.com/watch?v=eACohWVwTOc",
                          "https://www.youtube.com/watch?v=fT-KWU5cWrw",
                          "https://www.youtube.com/watch?v=5P9chWIZjyg&list=PLbS49ToVv9qGWLmI-MNPeGS2EPvfC5Vzt&index=4&t=0s",
                          "https://www.youtube.com/watch?v=lthp3ebPaTE&list=PLbS49ToVv9qGWLmI-MNPeGS2EPvfC5Vzt&index=12&t=0s",
                          "https://www.youtube.com/watch?v=3nQNiWdeH2Q",
                          "https://www.youtube.com/watch?v=K4DyBUG242c",
                          "https://www.youtube.com/watch?v=Lq2UrnDsI_s",
                          "https://www.youtube.com/watch?v=TYV3VlhWPAw"]

            var num = Math.floor((Math.random() * rsongs.length) + 0);

            message.channel.send("Now playing:\n" + `${rsongs[num]}`)
                .then(message => {
                    message.delete(10000)
                });

            if(message.guild.voiceConnection) {
                message.guild.voiceConnection.disconnect();
            }
            server.queue.push(rsongs[num]);

            //var num = Math.floor((Math.random() * 8) + 0);

            if (!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection) {
                play(connection, message)
            });
            message.delete();
            break;
                    if(message.channel != musicchan && !message.member.roles.find("name", "Owner")){
                message.delete();
                return message.channel.send("Please use " + musicchan + " for music commands")
                    .then(message => {
                    message.delete(5000)
                });
            }
            if(!message.member.voiceChannel){
                return message.channel.send("You must be in a voice channel to run this command")
                    .then(message => {
                        message.delete(5000)
                    });
            }

            if(!servers[message.guild.id]) servers[message.guild.id] = {
                queue: []
            };

            var server = servers[message.guild.id];

            if(message.guild.voiceConnection) {
                message.guild.voiceConnection.disconnect();
            }

            server.queue.push("https://www.youtube.com/watch?v=7ODcC5z6Ca0");

            if (!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection) {
                play(connection, message)
            });
            message.delete();
            break;
        case "fail":
            if(message.channel != musicchan && !message.member.roles.find("name", "Owner")){
                message.delete();
                return message.channel.send("Please use " + musicchan + " for music commands")
                    .then(message => {
                    message.delete(5000)
                });
            }
            if(!message.member.voiceChannel){
                return message.channel.send("You must be in a voice channel to run this command")
                    .then(message => {
                        message.delete(5000)
                    });
            }

            if(!servers[message.guild.id]) servers[message.guild.id] = {
                queue: []
            };

            var server = servers[message.guild.id];

            if(message.guild.voiceConnection) {
                message.guild.voiceConnection.disconnect();
            }

            server.queue.push("https://www.youtube.com/watch?v=9RAbYECBpVA");

            if (!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection) {
                play(connection, message)
            });
            message.delete();
            break;
        case "wtf":
            if(message.channel != musicchan && !message.member.roles.find("name", "Owner")){
                message.delete();
                return message.channel.send("Please use " + musicchan + " for music commands")
                    .then(message => {
                    message.delete(5000)
                });
            }
            if(!message.member.voiceChannel){
                return message.channel.send("You must be in a voice channel to run this command")
                    .then(message => {
                        message.delete(5000)
                    });
            }

            if(!servers[message.guild.id]) servers[message.guild.id] = {
                queue: []
            };

            var server = servers[message.guild.id];

            if(message.guild.voiceConnection) {
                message.guild.voiceConnection.disconnect();
            }

            server.queue.push("https://www.youtube.com/watch?v=UBQP9gEldRk");

            if (!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection) {
                play(connection, message)
            });
            message.delete();
            break;
            case "leaderboard":
            if(message.channel != bcmds && !message.member.roles.find("name", "Owner")){
                message.delete();
                return message.channel.send("Please use " + bcmds + " for bot commands (Except Report And Suggest)")
                    .then(message => {
                    message.delete(5000)
                });
            }
            let leaderembed = new Discord.RichEmbed()
            .setTitle("Leaderboard")
            .setColor("#ff7700")
            .addField("1.God", "Name:OllieTG\nWins:107\nKills:2356", true)
            .addField("3.Titanium" ,"Name:Cam123049\nWins:50\nKills:1082",true)
            //.addBlankField(true)
            .addField("5.Silver" ,"Name:CommandoPlays\nWins:25\nKills:312",true)
            .addField("2.Platinum" ,"Name:Kioxo9\nWins:100\nKills:3322", true)
            //.addBlankField(true)
            .addField("4.Gold" ,"Name:GoodGuyPaint\nWins:40\nKills:846",true)
            .addField("6.Bronze" ,"Name:Zlentio\nWins:15\nKills:1050",true)
            //.addBlankField(true)
            .setFooter("Think this is wrong? Private Message @Paint#5464 Or @Cam123049#3422 with your wins and fortnite account name!");
            message.channel.send(leaderembed);
            message.delete();
            break;
        case "youtube":
            message.delete();
            message.author.send("You can find our youtube at:\n https://www.youtube.com/channel/UCBTyEMmVrIk5gPY9h1PQRfA");
            break;
        case "twitch":
            message.delete();
            message.author.send("You can find our youtube at:\n https://www.twitch.tv/itsyaboiisalt/");
            break;
        case "twitter":
            message.delete();
            message.author.send("Oh No!:\n It seems our twitter is still under development!");
            break;
        case "purge":
            async function purge() {
                message.delete(); // Let's delete the command message, so it doesn't interfere with the messages we are going to delete.

                // Now, we want to check if the user has the `bot-commander` role, you can change this to whatever you want.
                if (!message.member.roles.find("name", "Owner")) { // This checks to see if they DONT have it, the "!" inverts the true/fals
                    return; // this returns the code, so the rest doesn't run.
                }

                // We want to check if the argument is a number
                if (isNaN(args[1])) {
                    // Sends a message to the channel.
                    message.channel.send('Please use a number as your arguments. \n Usage: ' + PREFIX + 'purge <amount>')
                    .then(message => {
                        message.delete(5000)
                    }); //\n means new line.
                    // Cancels out of the script, so the rest doesn't run.
                    return;
                }

                const fetched = await message.channel.fetchMessages({limit: args[1]}); // This grabs the last number(args) of messages in the channel. // Lets post into console how many messages we are deleting

                // Deleting the messages
                message.channel.bulkDelete(fetched)
                    .catch(error => message.channel.send(`Error: ${error}`));
                    
                message.channel.send('🗑️' + fetched.size + ' messages found and deleted🗑️')
                    .then(message => {
                        message.delete(5000)
                    });// If it finds an error, it posts it into the channel.

            }

            // We want to make sure we call the function whenever the purge command is run.
            purge(); // Make sure this is inside the if(msg.startsWith)

            break;


        default:
            message.channel.send("Invalid command do ``=help`` for help! or ask @Paint#5464 (My creator)")
                .then(message => {
                    message.delete(10000)
                });
            message.delete();
        }



//-------------------------------------------------------//
//        Remember To Set Deletes For All Messages       //
//-------------------------------------------------------//
});

bot.login(TOKEN);

