const {Genesis_data, MINE_RATE} =require('./genesis');
const cryptoHash=require('./hashalgo');
const hextobinary=require('hex-to-binary')

class Block{
    constructor({ timestamp,prevHash,hash,data,nonce,difficulty }){
        this.timestamp=timestamp;
        this.prevHash=prevHash;
        this.hash=hash;
        this.data=data;
        this.nonce=nonce;
        this.difficulty=difficulty;
    }
    //using static to avoid creating function everytime for a new block
    static genesis(){
        return new this(Genesis_data);
    }
    static mineBlock({prevBlock,data}){
        //const timestamp=Date.now();
        let hash,timestamp;
        const prevHash=prevBlock.hash;
        let { difficulty }=prevBlock;

        let nonce=0;
        //  until we reach our target increment nonce
        do{
            nonce++;
            timestamp=Date.now();
            difficulty=Block.adjustDifficulty({
                originalBlock:prevBlock,
                timestamp,
            })
            hash=cryptoHash(timestamp,prevHash,data,nonce,difficulty);
        }while(hextobinary(hash).substring(0,difficulty)!=='0'.repeat(difficulty));
        return new this({
            timestamp,
            prevHash,
            data,
            difficulty,
            nonce,
            hash,
        });
    }
    static adjustDifficulty({originalBlock,timestamp}){
        const{difficulty}=originalBlock;
        if(difficulty<1) return 1;
        const diff=timestamp-originalBlock.timestamp;
        if(diff>MINE_RATE) return difficulty-1;
        return difficulty+1;
    }
}


// const genesisBlock=Block.genesis();
// console.log(genesisBlock)
module.exports=Block;