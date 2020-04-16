import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

interface Score {
    username: string,  
    score: number,
    datetime: Date
  }
  
export class FirebaseService {
    public db: AngularFirestore;
    highScoresCollectionRef: AngularFirestoreCollection<Score>;
    highScores: any;
    
    constructor(af: AngularFirestore) {
        this.db = af;
        this.highScoresCollectionRef = af.collection<Score>('scores', ref => ref.orderBy('score', 'desc').limit(10));
        this.highScores = this.highScoresCollectionRef.valueChanges();
    }

    createScore(value) {
        if (value.score >= 5) {
            return this.db.collection<Score>('scores').add({
                username: value.username,
                score: value.score,
                datetime: new Date()
            });
        }
        
    }

    getScores() {
        
        return this.db.collection<Score>('scores', ref => ref.orderBy('score', 'desc').limit(10)).valueChanges();                
    }

}