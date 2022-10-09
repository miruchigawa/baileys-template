const { default: _makeWaSocket, AnyMessageContent, delay, DisconnectReason, fetchLatestBaileysVersion, useSingleFileAuthState, downloadContentFromMessage, jidDecode, makeInMemoryStore } = require('@adiwajshing/baileys')
const pino = require('pino')
const fs = require('fs')
const { state, saveState } = useSingleFileAuthState('./azuxi.json')
const print = console.log;
const startHandler = async() => {
  const conn = _makeWaSocket({
    logger: pino({level: 'silent'}),
    printQRInTerminal: true,
    auth: state
  })
  conn.ev.on('chats.set', item => console.log(`recv ${item.chats.length} chats (is latest: ${item.isLatest})`))
  conn.ev.on('messages.set', item => console.log(`recv ${item.messages.length} messages (is latest: ${item.isLatest})`))
  conn.ev.on('contacts.set', item => console.log(`recv ${item.contacts.length} contacts`))
  

 conn.ev.on('connection.update', async(update) => {
   
    const { connection, lastDisconnect } = update
    
    if (connection === 'close') {
      
      lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut ? startHandler() : print('[!] Connection lost'.warn)
    }
    print('[!] Get Qr'.warn, update)
  })
  conn.ev.on('creds.update', saveState)	
  return conn
}
startHandler()