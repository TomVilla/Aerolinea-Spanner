import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import { FlightService } from '../core/services/flight.service';
import { format } from 'date-fns';

@Component({
  selector: 'app-vuelos',
  templateUrl: './vuelos.component.html',
  styleUrls: ['./vuelos.component.css'],

})
export class VuelosComponent implements OnInit {
  flights: any[] = [];
  rows: number = 10;
  mod_vuelo: boolean = false;
  formVuelo: FormGroup;
  asientos: any[] = [];
  mod_flight: boolean = false;
  loading: boolean = false;
  loading_creacion: boolean = false;
  loading_delete: boolean = false;

  ngOnInit(): void {
    this.getFlights();
  }

  getFlights() {
    this.fS.getFlights().subscribe((data) => {
      if (data) {
        this.flights = data;
      }
    });
  }

  constructor(
    private fS: FlightService,
    private fB: FormBuilder,
    private messageService: MessageService
  ) {
    this.formVuelo = this.createForm();
  }

  saveVuelo() {
    this.mod_flight = false;
    this.loading = true;
    this.loading_creacion = true;
    let fecha = this.formVuelo.get('flightdate')?.value;
    fecha = format(new Date(fecha), 'yyyy-MM-dd');
    console.log(fecha)
    this.fS.postFlight({...this.formVuelo.value, flightdate: fecha }).subscribe((data) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Vuelo creado exitosamente',
      });
      this.getFlights();
      this.loading_creacion = false;
      this.loading = false;
      return;
    })
  }

  eliminar(flight: any) {
    this.loading = true;
    this.loading_delete = true;
    this.fS.deleteFlight(flight.flightid).subscribe({
      next: (data) => {
        if(data != null) {
          this.getFlights();
          this.messageService.add({
            severity: 'success',
            summary: 'Vuelo eliminado exitosamente',
          });
          this.loading_delete = false;
          this.loading = false;
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Vuelo no eliminado',
          });
          this.loading_delete = false;
          this.loading = false;
        }
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Vuelo no eliminado',
        });
        this.loading_delete = false;
        this.loading = false;
      }
      
    });
  }

  createForm(): FormGroup {
    return this.fB.group({
      flightid: [null, [Validators.required]],
      flightsource: [null, [Validators.required]],
      flightdest: [null, [Validators.required]],
      asiento: [null, [Validators.required]],
      costo: [null, [Validators.required]],
      flightdate: [null]
    });
  }

  reservar(flight: any) {
    this.mod_vuelo = true;
    this.formVuelo.patchValue(flight);
    this.formVuelo.disable();
    this.asientoField?.enable();
    this.fS.getSeats(flight.flightid).subscribe((data) => {
      this.asientos = data;
      console.log(data);
    });
  }

  changeAsiento() {
    const asiento = this.asientos.find(
      (item) => item.seatid == this.asientoField?.value
    );
    if (asiento && asiento.seatcost)
      this.costoField?.setValue(asiento.seatcost);
    else this.costoField?.setValue(null);
  }

  onCloseModal() {
    this.mod_vuelo = false;
    this.mod_flight = false;
    this.formVuelo.reset();
    this.formVuelo.enable();
  }

  saveReserva() {
    if (this.formVuelo.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'No se pudo realizar la reserva',
        detail: 'Debe escoger un asiento disponible',
      });
      return;
    } else {
      this.formVuelo.disable();

      this.fS.postBooking({
        bookdate: format(new Date(), 'yyyy-MM-dd'),
        flightid: this.flightIdField?.value,
        seatid: this.formVuelo.get('asiento')?.value
      }).subscribe((value) => {

        this.messageService.add({
          severity: 'success',
          summary: 'Reserva realizada satisfactoriamente',
        });
        this.formVuelo.enable();
        this.mod_vuelo = false;
      })
    }
  }

  get destinoField() {
    return this.formVuelo.get('flightdest');
  }

  get salidaField() {
    return this.formVuelo.get('flightsource');
  }

  get asientoField() {
    return this.formVuelo.get('asiento');
  }

  get costoField() {
    return this.formVuelo.get('costo');
  }

  get flightIdField() {
    return this.formVuelo.get('flightid');
  }
}
