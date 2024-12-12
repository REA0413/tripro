declare module 'amadeus' {
  interface AmadeusConstructor {
    clientId: string;
    clientSecret: string;
  }

  interface AmadeusStatic {
    new(config: AmadeusConstructor): Amadeus;
    location: {
      airport: string;
    };
  }

  interface Amadeus {
    shopping: {
      flightOffersSearch: {
        get(params: {
          originLocationCode: string;
          destinationLocationCode: string;
          departureDate: string;
          adults?: number;
          max?: number;
        }): Promise<{ data: any[] }>;
      };
    };
    referenceData: {
      locations: {
        get(params: {
          keyword: string;
          subType: string;
        }): Promise<{ data: any[] }>;
      };
      airlines: {
        get(params: {
          airlineCodes: string;
        }): Promise<{ data: any[] }>;
      };
    };
  }

  const Amadeus: AmadeusStatic;
  export default Amadeus;
} 