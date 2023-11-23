import { TripPattern } from '../../../server/journey-planner/validators';

export const tripPatternFixture: TripPattern = {
  expectedStartTime: '2023-01-01T00:00:00+01:00',
  expectedEndTime: '2023-01-01T01:00:00+01:00',
  duration: 3600,
  walkDistance: 0,
  legs: [
    {
      mode: 'bus',
      distance: 1,
      duration: 1,
      aimedStartTime: '2023-01-01T00:00:00+01:00',
      aimedEndTime: '2023-01-01T01:00:00+01:00',
      expectedEndTime: '2023-01-01T01:00:00+01:00',
      expectedStartTime: '2023-01-01T00:00:00+01:00',
      realtime: false,
      transportSubmode: 'regionalBus',
      line: {
        id: 'ATB:Line:1',
        name: 'Line',
        transportSubmode: 'regionalBus',
        publicCode: '1',
        flexibleLineType: null,
        notices: [],
      },
      fromEstimatedCall: {
        aimedDepartureTime: '2023-01-01T00:00:00+01:00',
        expectedDepartureTime: '2023-01-01T01:00:00+01:00',
        destinationDisplay: {
          frontText: 'Destination',
        },
        quay: {
          publicCode: '',
          name: 'Quay',
        },
        notices: [],
      },
      situations: [],
      fromPlace: {
        name: 'From',
        longitude: 0,
        latitude: 0,
        quay: {
          publicCode: '1',
          name: 'From',
          id: 'NSR:Quay:1',
          situations: [],
        },
      },
      toPlace: {
        name: '2',
        longitude: 0,
        latitude: 0,
        quay: {
          publicCode: '2',
          name: '2',
          id: 'NSR:Quay:2',
          situations: [],
        },
      },
      serviceJourney: {
        id: 'ATB:ServiceJourney:1',
        notices: [],
        journeyPattern: {
          notices: [],
        },
      },
      rentedBike: null,
      interchangeTo: null,
      pointsOnLink: {
        points:
          'yscbKgbqfAaJzl@oEx^??oAdKi@zDc@hBaAjC_@t@aA`BeUn]kApBg@pAo@jCa@bCWlCEt@e@tJ??sBpe@WlEQ|Bs@bGq@vD??_DpMsAhF{@dCy@dBgDtG??gA`Cw@rBc@jB[vBQvBEpB@~Bp@nM??LjEL`P\\da@J|EThGlAfV??TdFH`D?fC_Av_@CzB??AnCJhe@??@|RG`ZBtFP`Ij@bM??DfC?zBGxCUdD_@dDm@jDa@|Ai@`B}ArDw@`Ce@xBKt@oAhLiAjIUhECtCF~BTjD^pCPz@bBxGJb@FET\\??U]GDj@xDThCFlBD~C?xFCzAKjBOnAMx@cAtEiBxK]zAcB`G]bBs@fFY`C??y@bIc@nFMnCa@xLQdDIdAS~AQfASx@sAtEkAtEgArDwF~Qg@vA{@zAeE|FgFjGwA~Bk@lAa@`Aa@lAa@|Am@bDe@hD_@jF_AtNM|AOtA_@vBWjAaBbG??gFfRk@dC_@~BKrAGhBAnCD`BPbCx@dFTjBThCH`BD|BBxMRlOA~BIbC_@fFq@vGo@fEgChOk@zCu@xCeDfL{Ir_@k@pCm@vB}A`Hq@|DUjBMjBKdDA`CJvLHlGFpBHjBv@hLF~ABxB?vAGrCY~FW|CeB|PWvCOzDQ~MS|FYlE}@dJQ~CGnEBhLCtEe@z\\KxEKtCYnEa@`EYbC_@tBoAfF{@pEKI??nl@t~KCA]xEWtFG|BI|G@rKD`GH~BPjBnAzHRrBd@`HVxBPfAXjA|AtFd@hBPhARbBLzBFvC?`AEtAMrAS`A[|@_IzQc@pAw@fDoGdZeAzF[jCQxBO~BIlCoAns@??CzCBvCNbFJpBpArPHdBFhB@tBElAq@tLObEaAhl@D@JTFV@\\A^??Mp@SGKxFCnDFvDFnAj@pIF~C?x@ElBKpBMlA{CfWWpCEz@MCONCPE|@???lA\\F?|@HvDZzFHdA^~Bt@nDtAtH~@~FtA~JLrALrBHhD@vBh@rmBEjGu@|i@C|B@`CN`FLrCZvGV|D`@fFtF~n@P`CHnBJfDDfC@vCEfCEvAOdCQjBw@~F??sDxWs@zGMfBI~BEfFHzG??h@zPH~ALlAT`BVfA^rA`BdEp@pBxCdLf@~Az@vBpDjHd@v@j@t@nDhD|AjBvAxBvDtG~FvI|@z@x@d@|HbDvA~@v@t@t@`AbCbEdAvB`A`CbAnCfBzFjAjEh@~B`AfFbA|G]d@Lt@??PfAHHRMl@jG^pFjEbq@TlDL`D??ZpJD`EAlE}@nlCEjBGzAQnBUpB[lB[xA[`AGQwgBx{DJHePvaB{@nJyAlRW[EU??DTVZcEhi@??Q~B]xGOdEc@rQc@rTO~OAtCDhIx@`a@??P~YF~DJjE~@zY`@pKd@dKx@lMbDj`@J`BRGFFB\\@tBA?aOrgCLHM`DGlCCbFDjDHbCJrB`@`F\\zCbAnGr@hFp@xG`@hFLhCJbDFrD@~B?~BEdCeBb_@QdE[fR??C`BA|FFjL?dBGfESbE_@zDsBjN[nDQvDGbE]BIzA??BbAd@S@n@^vJn@jLl@rH~@jI|ArKzA`IR|@v@|CrB|F^vA^bCNzBFnBDpD`@x]I?jStnC??yTngEEFEWMYqBzNyApLsB`RcBvPsAtOqIpkAk@rJUpFMzEIdEErICh@?v@RfJ@nBM^Aj@@PLb@DFFrBA|D@p@Dv@~@pMHjADJn@hH`@pFJzCFjEOdLIjN@rBCrIBdLIlCCFq@LaDG??kKW@xH??Jhm@p@AAxCDFj@?',
        length: 530,
      },
      intermediateEstimatedCalls: [],
      authority: {
        id: 'ATB:Authority:2',
      },
    },
  ],
};
