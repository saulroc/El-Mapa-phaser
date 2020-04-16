import { Injectable } from '@angular/core';

import { ToastController } from '@ionic/angular';

@Injectable({

    providedIn: 'root'

})

export class ToastService {

    constructor(private toastController: ToastController) {}

    async present(message) {

        const toast = await this.toastController.create({

            message,

            duration: 2000

        });

        toast.present();

    }

}