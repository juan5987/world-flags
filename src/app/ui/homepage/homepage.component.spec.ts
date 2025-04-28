import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomepageComponent } from './homepage.component';

describe('HomepageComponent', () => {
  let component: HomepageComponent;
  let fixture: ComponentFixture<HomepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomepageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display an h1 with "World Flags"', () => {
    const compiled = fixture.nativeElement;
    const h1 = compiled.querySelector('h1');
    expect(h1).toBeTruthy();
    expect(h1.textContent).toContain('World Flags');
  });

  
  it('should display a button with "Jouer"', () => {
    const compiled = fixture.nativeElement;
    const button = compiled.querySelector('button#homepage__buttons__play');
    expect(button).toBeTruthy();
    expect(button.textContent).toContain('Jouer');
  });

  it('should display a button with "Classement"', () => {
    const compiled = fixture.nativeElement;
    const button = compiled.querySelector('button#homepage__buttons__ranking');
    expect(button).toBeTruthy();
    expect(button.textContent).toContain('Classement');
  });

  it('should display a button with "Entrainement"', () => {
    const compiled = fixture.nativeElement;
    const button = compiled.querySelector('button#homepage__buttons__training');
    expect(button).toBeTruthy();
    expect(button.textContent).toContain('Entrainement');
  });

  it('should display a "Connexion" or "Déconnexion" button', () => {
    const compiled = fixture.nativeElement;
    const connexionButton = compiled.querySelector('button#homepage__buttons__login');
  
    expect(connexionButton).toBeTruthy();
  
    const buttonText = connexionButton.textContent.trim();
    expect(buttonText === 'Connexion' || buttonText === 'Déconnexion').toBeTrue();
  });
  
});
