import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageLots } from './manage-lots';

describe('ManageLots', () => {
  let component: ManageLots;
  let fixture: ComponentFixture<ManageLots>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageLots],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageLots);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
