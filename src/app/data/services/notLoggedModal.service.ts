import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotLoggedModalService {
  public isModalOpen: WritableSignal<boolean> = signal(false);

  public openModal() {
    this.isModalOpen.set(true);
  }

  public closeModal() {
    this.isModalOpen.set(false);
  }
}
