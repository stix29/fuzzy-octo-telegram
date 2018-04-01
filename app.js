const Discord = require("discord.js");
const client = new Discord.Client();
const private = require("./private.json");
const fs = require("fs")

client.login(private.token)

client.on("ready", async() =>{
    console.log("It's a beautiful day to save lives!")
    client.user.setActivity("with stix")
    client.user.setStatus("dnd")
});

client.commands = new Discord.Collection();
client.mutes = require("./mutes.json");

fs.readdir("./commands", (err, files) => {
    if(err) console.error(err);
    let jsFiles = files.filter(f => f.split(".").pop() === "js");
    if(jsFiles.length <= 0) {
        console.log("No commands to load");
        return;
    }
    console.log(`Loading ${jsFiles.length} commands`);

    jsFiles.forEach((f, i) => {
        let props = require(`./commands/${f}`)
        client.commands.set(props.help.name, props)
    });
});

let prefix = "+"
client.on("message", async(message) => {
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;
    let guild = message.guild;
     let args = message.content.split(" ").slice(1).join(" ");
     let command = message.content.split(" ")[0];
     if(!command.startsWith(prefix)) return;

     let cmd = client.commands.get(command.slice(prefix.length));
     if (cmd)
        cmd.run(client, message, args);
});