import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchLots } from './search-lots';

describe('SearchLots', () => {
  let component: SearchLots;
  let fixture: ComponentFixture<SearchLots>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchLots],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchLots);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
