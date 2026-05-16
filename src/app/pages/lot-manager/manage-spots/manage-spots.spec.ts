import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSpots } from './manage-spots';

describe('ManageSpots', () => {
  let component: ManageSpots;
  let fixture: ComponentFixture<ManageSpots>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageSpots],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageSpots);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
