import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSubjectManage } from './admin-subject-manage';

describe('AdminSubjectManage', () => {
  let component: AdminSubjectManage;
  let fixture: ComponentFixture<AdminSubjectManage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSubjectManage],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminSubjectManage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
