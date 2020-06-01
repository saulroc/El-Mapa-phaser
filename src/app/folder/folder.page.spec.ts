import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FolderPage } from './folder.page';

describe('FolderPage', () => {
  let component: FolderPage;
  let fixture: ComponentFixture<FolderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FolderPage ],
      imports: [IonicModule.forRoot(), RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(FolderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Debe renderizar el folder', () => {
    let folder = 'Inbox'
    component.folder = folder;
    fixture.detectChanges();

    let de = fixture.debugElement.query(By.css('.ion-title'));
    let el: HTMLElement = de.nativeElement;

    expect(el.innerText).toContain(folder);
  });

  it('Debe inicializar ion-phaser si está a true inicialize', () => {
    let folder = 'Inbox'
    component.folder = folder;
    fixture.detectChanges();

    let de = fixture.debugElement.query(By.css('.ion-title'));
    let el: HTMLElement = de.nativeElement;

    expect(el.innerText).toContain(folder);
  });
});
