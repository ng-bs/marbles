import { DataService } from './data.service';
import { Person } from './sw.models';
import { cold } from 'jasmine-marbles';
import { TestScheduler } from 'rxjs/testing';
import { throttleTime } from 'rxjs/operators';

fdescribe('DataService', () => {
  let mockPeople;
  beforeEach(() => {
    mockPeople = [
      { name: 'Juke Piewalker' },
      { name: 'Sobe Han' }
    ] as Person[];
  });
  describe('getPeople', () => {
    let mockHttp;
    let dataService: DataService;
    beforeEach(() => {
      mockHttp = jasmine.createSpyObj('HttpClient', ['get']);
      dataService = new DataService(mockHttp);
    });
    it('should get people', () => {
      const httpCall = cold('a|', { a: { results: mockPeople } });
      mockHttp.get.and.returnValue(httpCall);
      const actual = dataService.getPeople();
      const expected = cold('a|', { a: mockPeople });
      expect(actual).toBeObservable(expected);
    });
    it('should return an empty array when the http call fails', () => {
      const httpGetResult = cold('#');
      mockHttp.get.and.returnValue(httpGetResult);
      const actual = dataService.getPeople();
      //                 bag of marbles
      const expected = cold('(a|)', { a: [] });
      expect(actual).toBeObservable(expected);
    });
    fit('should fail if the http call takes too long', () => {
      // const httpCall = cold('2000ms', { a: { results: mockPeople } });
      // mockHttp.get.and.returnValue(httpCall);
      // const actual = dataService.getPeople();
      // const expected = cold('-#');
      // expect(actual).toBeObservable(expected);
      const testScheduler = new TestScheduler((a, e) => {
        // asserting the two objects are equal
        // e.g. using chai.
        expect(a).toEqual(e);
      });
      testScheduler.run(helpers => {

        const { expectObservable } = helpers;
        const httpCall = helpers.cold('2000ms');
        mockHttp.get.and.returnValue(httpCall);
        const actual = dataService.getPeople();
        // const expected = cold('1000ms (a|)', { a: [] });
        // expect(actual).toBeObservable(expected);
        expectObservable(actual
          .pipe(throttleTime(1, testScheduler)))
          .toBe('(a|)', { a: [] });
      });
    });
    it('should fail if the http call takes too long 2', () => {
      const httpCall = cold('2000ms |');
      mockHttp.get.and.returnValue(httpCall);
      dataService.getPeople().subscribe(people => {
        expect(people).toEqual([]);
      });
      // const expected = cold('1000ms -(a|)', { a: [] });
      // expect(actual).toBeObservable(expected);
    });
  });
});
