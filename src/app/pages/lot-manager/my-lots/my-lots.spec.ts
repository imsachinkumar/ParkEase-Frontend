import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyLots } from './my-lots';

describe('MyLots', () => {
  let component: MyLots;
  let fixture: ComponentFixture<MyLots>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyLots],
    }).compileComponents();

    fixture = TestBed.createComponent(MyLots);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
