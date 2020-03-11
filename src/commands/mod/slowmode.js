const Command = require('../Command.js');

module.exports = class SlowmodeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'slowmode',
      aliases: ['slow', 'sm'],
      usage: '<CHANNEL MENTION> <RATE> <REASON>',
      description: 'Enables slowmode in a channel with the specified rate (provide a rate of 0 to disable).',
      type: 'mod',
      clientPermissions: ['SEND_MESSAGES', 'MANAGE_CHANNELS'],
      userPermissions: ['MANAGE_CHANNELS']
    });
  }
  async run(message, args) {
    let channel = this.getChannelFromMention(message, args[0]);
    if (!channel)
      return message.channel.send(`Sorry ${message.member}, I don't recognize that. Please mention a text channel.`);
    const rate = args[1];
    if (!rate || rate < 0 || rate > 59) 
      return message.channel.send(`${message.member}, please provide a rate limit between 0 and 59 seconds.`);
    let reason = args.slice(2).join(' ');
    if(!reason) reason = 'No reason provided';
    await channel.setRateLimitPerUser(rate, reason); // set channel rate
    // Slowmode disabled
    if (rate === '0') {
      return message.channel.send(`Slowmode in ${channel} has been **disabled**.`);
    // Slowmode enabled
    } else {
      return message.channel.send(`Slowmode in ${channel} has been **enabled** with a rate of **${rate}s**.`);
    }
  }
};