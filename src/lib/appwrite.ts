import { Client, Account, Databases, Storage } from 'appwrite'

const client = new Client()
    .setEndpoint("https://syd.cloud.appwrite.io/v1")
    .setProject("69d77850001bef04a924")

const account = new Account(client)
const databases = new Databases(client)
const storage = new Storage(client)

export { client, account, databases, storage }