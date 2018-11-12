import { TestBed } from '@angular/core/testing';

import { NgxLinkedinService } from './ngx-linkedin.service';

describe('NgxLinkedinService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: NgxLinkedinService = TestBed.get(NgxLinkedinService);
        expect(service).toBeTruthy();
    });
});
