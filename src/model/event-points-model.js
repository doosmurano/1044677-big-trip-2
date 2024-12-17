import { mockOffers } from '../mock/offers.js';
import Observable from '../framework/observable.js';
import { mockEventPoints } from '../mock/event-points.js';
import { mockDestinations } from '../mock/destination-points.js';

export default class EventPointsModel extends Observable {
  #eventPointsApiService = null;

  #offers = mockOffers;
  #points = mockEventPoints;
  #destinations = mockDestinations;

  constructor({eventPointsApiService}) {
    super();
    this.#eventPointsApiService = eventPointsApiService;

    this.#eventPointsApiService.points.then((points) => {
      console.log(points.map(this.#adaptToClient));
    });
  }

  get points() {
    return this.#points;
  }

  get offers() {
    return this.#offers;
  }

  get destinations() {
    return this.#destinations;
  }

  getOffersByType(type) {
    const allOffers = this.offers;
    return allOffers.find((offer) => offer.type === type);
  }

  getOffersById(type, offersId) {
    if (!type || !offersId) {
      return [];
    } else {
      const offersType = this.getOffersByType(type);
      return offersType.offers.filter((item) => offersId.find((id) => item.id === id));
    }
  }

  getDestinationById(id) {
    const allDestinations = this.destinations;
    return allDestinations.find((destination) => destination.id === id);
  }

  updatePoint(updateType, updatedPoint) {
    const index = this.#points.findIndex((point) => point.id === updatedPoint.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      updatedPoint,
      ...this.#points.slice(index + 1),
    ];
    this._notify(updateType, updatedPoint.id);
  }

  addPoint(updateType, newPoint) {
    this.#points = [
      newPoint,
      ...this.#points,
    ];
    this._notify(updateType, newPoint.id);
  }

  deletePoint(updateType, point) {
    const index = this.#points.findIndex((item) => item.id === point.id);
    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }
    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1),
    ];
    this._notify(updateType, point.id);
  }

  #adaptToClient(point) {
    const adaptedPoint = {...point,
      basePrice: point['base_price'],
      dateFrom: point['date_from'] !== null ? new Date(point['date_from']) : point['date_from'],
      dateTo: point['date_to'] !== null ? new Date(point['date_to']) : point['date_to'],
      isFavorite: point['is_favorite'],
    };

    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  }
}
