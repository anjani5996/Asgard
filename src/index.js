describe('Series Controller', function () {
    let LocationService = null;
    let ContentApiService = null;
    let ContentServiceV3 = null;
    let seriesController = null;
    let deferred = null;
    let scope = null;
    let episodeIndex = null;
    beforeEach(module('airfi.platform.service'));
    beforeEach(module('angular.filter'));
    beforeEach(module('airfi.platform.filters'));
    beforeEach(module('ui.router'));
    beforeEach(module('pascalprecht.translate'));
    beforeEach(module('airfi.components'));
    const mockSeries = {
      type: "header",
      groupId: ["gp1", "gp2", "gp3"]
    }
    const mockComponentConfig = {
      sortOrderConfig: [{
        key: 'sequence',
        reverse: false
      }],
      displayLanguageSpecificContent: true
    }
    const mockAllHeaders = {
      data: [
        {
          type: "header",
          language: "eng",
          supportedLanguages: [
            "eng"
          ],
          sequence: 4,
          groupId: ['gp1'],
          startDate: '2019-01-01',
          endDate: '2019-12-12'
        },
        {
          type: "header",
          language: "eng",
          supportedLanguages: [
            "eng",
            "kor"
          ],
          sequence: 4,
          groupId: ['gp2'],
          startDate: '2019-01-02',
          endDate: '2019-09-22'
        },
        {
          type: "header",
          language: "kor",
          supportedLanguages: [
            "kor"
          ],
          sequence: 4,
          groupId: ['gp3'],
          startDate: '2019-01-03',
          endDate: '2019-12-12'
        },
        {
          type: "header",
          language: "eng",
          supportedLanguages: [
            "eng"
          ],
          sequence: 4,
          groupId: ['gp4'],
          startDate: '2019-01-04',
          endDate: '2019-12-12'
        }
      ]
    }
    const resultEpisodes = [
      {
        type: "header",
        language: "eng",
        supportedLanguages: [
          "eng"
        ],
        sequence: 4,
        groupId: ['gp1'],
        startDate: '2019-01-01',
        endDate: '2019-12-12',
        sequence: 1
      },
      {
        type: "header",
        language: "eng",
        supportedLanguages: [
          "eng"
        ],
        sequence: 4,
        groupId: ['gp4'],
        startDate: '2019-01-03',
        endDate: '2019-12-12',
        sequence: 2
      }
    ]
    const mockAllVideos = {
      data: [
        {
          type: "video",
          language: "eng",
          supportedLanguages: [
            "eng"
          ],
          sequence: 4,
          groupId: 'gp1',
          startDate: '2019-01-01',
          endDate: '2019-12-12'
        },
        {
          type: "video",
          language: "eng",
          supportedLanguages: [
            "eng",
            "kor"
          ],
          sequence: 4,
          groupId: 'gp2',
          startDate: '2019-01-02',
          endDate: '2019-09-22'
        },
        {
          type: "video",
          language: "kor",
          supportedLanguages: [
            "kor"
          ],
          sequence: 4,
          groupId: 'gp3',
          startDate: '2019-01-03',
          endDate: '2019-12-12'
        },
        {
          type: "video",
          language: "eng",
          supportedLanguages: [
            "eng"
          ],
          sequence: 4,
          groupId: 'gp4',
          startDate: '2019-01-04',
          endDate: '2019-12-12'
        }
      ]
    }
    const resultVideos = [
      {
        type: "video",
        language: "eng",
        supportedLanguages: [
          "eng"
        ],
        sequence: 4,
        groupId: 'gp1',
        startDate: '2019-01-01',
        endDate: '2019-12-12',
        sequence: 1,
        labels: 
        {
          title: 'title',
          shortDescription: 'shortDescription',
          longDescription: 'longDescription'
        }
      },
      {
        type: "video",
        language: "eng",
        supportedLanguages: [
          "eng"
        ],
        sequence: 4,
        groupId: 'gp4',
        startDate: '2019-01-03',
        endDate: '2019-12-12',
        sequence: 2,
        labels: {
          title: 'title',
          shortDescription: 'shortDescription',
          longDescription: 'longDescription'
        }
      }
    ]
    beforeEach(inject(function ($controller, $q, $rootScope, $stateParams, $filter, $window, AppConstants) {
      deferred = $q.defer()
      scope = $rootScope.$new();
      mockControllerDependencies();
      seriesController = $controller('SeriesController', {
        $stateParams,
        $filter,
        $window,
        AppConstants,
        LocationService,
        ContentApiService,
        ContentServiceV3,
      });
    }));
    afterEach(function () {
      whenSeriesToReset();
    });
    it('Should return filtered videos, If episodes are not defined but groupId is defined in series  ', () => {
      initialization("prepareEpisodeClips");
      spyMockContent("prepareEpisodeClips");
      seriesController.prepareEpisodeClips(episodeIndex);
      returnAllMockContentByContentType("prepareEpisodeClips");
      callMockedServiceMethods();
      expectOutputData('prepareEpisodeClips');
    });
    it('Should return filtered videos, if episodes are defined', () => {
      initialization("prepareEpisodeClips");
      defineEpisodes();
      spyMockContent("prepareEpisodeClips");
      seriesController.prepareEpisodeClips(episodeIndex);
      returnAllMockContentByContentType("prepareEpisodeClips");
      callMockedServiceMethods();
      expectOutputData('prepareEpisodeClips');
    });
    it('Should return filtered episodes, if groupid defined in series', () => {
      initialization("getEpisodes");
      spyMockContent("getEpisodes");
      seriesController.getEpisodes();
      returnAllMockContentByContentType("getEpisodes");
      callMockedServiceMethods();
      expectOutputData('getEpisodes');
    });
    it('Should retun zero episodes, if groupid not defined in series', () => {
      initialization("getEpisodes");
      spyMockContent("getEpisodes");
      delete seriesController.series.groupId;
      seriesController.getEpisodes();
      expect(ContentApiService.getContentByType).not.toHaveBeenCalled();
      expect(seriesController.episodes).toEqual([]);
    });
    function initialization(method) {
      seriesController.series = mockSeries;
      seriesController.componentConfig = mockComponentConfig;
      if (method === 'prepareEpisodeClips') {
        episodeIndex = resultEpisodes.length - 1;
      }
    }
    function returnAllMockContentByContentType(method) {
      if (method === 'prepareEpisodeClips') {
        deferred.resolve(mockAllVideos);
      } else if (method === 'getEpisodes') {
        deferred.resolve(mockAllHeaders);
      }
      scope.$apply();
    }
    function spyMockContent(method) {
      if (method === 'prepareEpisodeClips') {
        ContentServiceV3.filterByLanguage.and.returnValue(resultVideos);
        ContentServiceV3.sortContentList.and.returnValue(resultVideos);
      } else if (method === 'getEpisodes') {
        ContentServiceV3.filterByLanguage.and.returnValue(resultEpisodes);
        ContentServiceV3.sortContentList.and.returnValue(resultEpisodes);
      }
    }
    function callMockedServiceMethods() {
      expect(ContentServiceV3.filterByLanguage).toHaveBeenCalled();
      expect(ContentServiceV3.sortContentList).toHaveBeenCalled();
    }
    function defineEpisodes() {
      seriesController.episodes = resultEpisodes;
    }
    function expectOutputData(method) {
      if (method === 'prepareEpisodeClips') {
        expect(seriesController.clips).toEqual(resultVideos);
        expect(seriesController.video).toBeDefined();
        expect(seriesController.clipTitle).toBeDefined();
        expect(seriesController.clipShortDescription).toBeDefined();
        expect(seriesController.clipLongDescription).toBeDefined();
      } else if (method === 'getEpisodes') {
        expect(seriesController.episodes).toEqual(resultEpisodes);
        expect(seriesController.currentEpisodeNumber).toBeDefined();
      }
    }
    function whenSeriesToReset() {
      seriesController.episodes = [];
      seriesController.series = null;
    }
    function mockControllerDependencies() {
      mockContentApiService();
      mockLocationService();
      mockContentApiServiceV3();
    }
    function mockLocationService() {
      LocationService = jasmine.createSpyObj('LocationService', [
        'goBack'
      ])
    }
    function mockContentApiService() {
      ContentApiService = jasmine.createSpyObj('ContentApiService', [
        'getContentByType'
      ]);
      ContentApiService.getContentByType.and.returnValue(deferred.promise);
    }
    function mockContentApiServiceV3() {
      ContentServiceV3 = jasmine.createSpyObj('ContentServiceV3', [
        'filterByLanguage',
        'sortContentList'
      ])
    }
  });
  