import { Component, OnInit } from '@angular/core';
import { environment } from '../../../src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { MapSceneService } from '../services/map-scene.service';
import { PuebloSceneService } from '../services/pueblo-scene.service';

import * as Phaser from 'phaser';
//import GesturesPlugin from 'phaser3-rex-plugins/plugins/gestures-plugin.js';
import { GameOverSceneService } from '../services/game-over-scene.service';


interface GameInstance extends Phaser.Types.Core.GameConfig {
  instance: Phaser.Game
}

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
  providers: [MapSceneService, PuebloSceneService, GameOverSceneService]
})
export class FolderPage implements OnInit {
  public folder: string;
  public initialize: boolean = false;

  game: GameInstance = {
    title: environment.title,
    version: environment.version,
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight - 45,  
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },     
    physics: {
      default: 'arcade',
      arcade: {
          debug: false
      }
    },
    scene: [MapSceneService, PuebloSceneService, GameOverSceneService],
    /*plugins: {
      scene: [{
          key: 'rexGestures',
          plugin: GesturesPlugin,
          mapping: 'rexGestures'
      },
      ]
  },*/ 
    instance: null
  }

  constructor(private activatedRoute: ActivatedRoute,
    private mapSceneService: MapSceneService) { }

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
  }

  initializeGame() {    
    this.initialize = true

  }

  getInstance(){
    return this.game.instance;
  }

  changeAngle () {
    const instance = this.getInstance();
    instance.scene.scenes.forEach(scene => {
      if (scene.sys.isActive()) {
        //scene.setAngle(0);
      }
    });
  }

}
