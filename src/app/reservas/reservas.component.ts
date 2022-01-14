import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { FlightService } from '../core/services/flight.service';
import { format } from 'date-fns';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css']
})
export class ReservasComponent implements OnInit {
  bookings: any[] = [];
  rows: number = 10;
  mod_vuelo: boolean = false;
  formVuelo: FormGroup;
  asientos: any[] = [];
  booking: any;
  loading_reserva: boolean = false;

  constructor(
    private fS: FlightService,
    private fB: FormBuilder,
    private messageService: MessageService

  ) { 
    this.formVuelo = this.createForm();
  }

  ngOnInit(): void {
    this.fS.getBooking().subscribe((data) => {
      if (data) {
        this.bookings = data;
      }
    });
  }

  onCloseModal() {
    this.formVuelo.reset();
    this.formVuelo.enable();
    this.mod_vuelo = false;
    this.booking = null;
  }

  changeAsiento() {
    const asiento = this.asientos.find(
      (item) => item.seatid == this.asientoField?.value
    );
    if (asiento && asiento.seatcost)
      this.costoField?.setValue(asiento.seatcost);
    else this.costoField?.setValue(null);
  }

  createForm(): FormGroup {
    return this.fB.group({
      flightid: [null, [Validators.required]],
      flightsource: [null, [Validators.required]],
      flightdest: [null, [Validators.required]],
      seatid: [null, [Validators.required]],
      seatnumber: [null, [Validators.required]],
      seatcost: [null, [Validators.required]],
      flightdate: [null]
    });
  }

  actualizar(booking: any) {
    this.booking = booking;
    console.log(booking);
    this.mod_vuelo = true;
    this.formVuelo.patchValue(booking);
    this.formVuelo.disable();
    this.formVuelo.get('seatid')?.enable();
    this.fS.getSeats(booking.flightid).subscribe((data) => {
      this.asientos = data;
      console.log(data);
    });
  }

  updateReserva() {
    this.loading_reserva = true;
    console.log(this.formVuelo.value)
    this.formVuelo.disable();
    this.mod_vuelo = false;

    this.fS.updateBooking(this.booking.bookingid, {...this.formVuelo.value, bookdate: format(new Date(), 'yyyy-MM-dd')}).subscribe((datas) => {
      this.fS.getBooking().subscribe((data) => {
        if (data) {
          this.bookings = data;
          this.loading_reserva = false;
        }
      });
    });
  }

  eliminiar(booking: any) {
    this.fS.deleteBooking(booking.bookingid).subscribe((data) => {
        this.bookings.splice(this.bookings.findIndex(item => item.bookingid == booking.bookingid), 1);
        this.messageService.add({
          severity: 'success',
          summary: 'Reserva eliminada correctamente',
        });
      
    })
  }

  get asientoField() {
    return this.formVuelo.get('seatid');
  }

  get costoField() {
    return this.formVuelo.get('seatcost');
  }
}
