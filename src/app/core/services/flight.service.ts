import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FlightService {

  constructor(private httpClient: HttpClient) { }

  getFlights(): Observable<any> {
    return this.httpClient.get('http://localhost:3000/flights').pipe(map((response: any) => response.data));
  }

  getSeats(flightId: number): Observable<any> {
    return this.httpClient.get(`http://localhost:3000/seats/flight/${flightId}`).pipe(map((response: any) => response.data));
  }

  postBooking(data: any): Observable<any> {
    return this.httpClient.post(`http://localhost:3000/bookings`, data).pipe(map((response: any) => response.data));
  }

  postFlight(data: any): Observable<any> {
    return this.httpClient.post(`http://localhost:3000/flights`, data).pipe(map((response: any) => response.data));
  }

  deleteFlight(id: number): Observable<any> {
    return this.httpClient.delete(`http://localhost:3000/flights/${id}`).pipe(map((response: any) => response.data));
  }

  updateBooking(id:number, data: any): Observable<any> {
    return this.httpClient.put(`http://localhost:3000/bookings/${id}`, data).pipe(map((response: any) => response.data));
  }

  getBooking(): Observable<any> {
    return this.httpClient.get(`http://localhost:3000/bookings`).pipe(map((response: any) => response.data));
  }

  deleteBooking(id: number): Observable<any> {
    return this.httpClient.delete(`http://localhost:3000/bookings/${id}`).pipe(map((response: any) => response.data));
  }
}
