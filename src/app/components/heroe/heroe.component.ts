import { Component, OnInit } from '@angular/core';
import { HeroeModel } from '../../models/heroe.model';
import { NgForm } from '@angular/forms';
import { HeroesService } from '../../services/heroes.service';
import swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-heroe',
  templateUrl: './heroe.component.html',
  styleUrls: ['./heroe.component.css']
})
export class HeroeComponent implements OnInit {

  heroe = new HeroeModel();
  boton: string;

  constructor(private heroesService: HeroesService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.boton = id;
    if (id !== 'nuevo') {
      this.heroesService.getHeroe(id)
      .subscribe( (resp: HeroeModel) => {
        this.heroe = resp;
        this.heroe.id = id;
        console.log(this.heroe.id);
      });
    }
  }

  guardar(form: NgForm){

    if (form.invalid) {
      console.log('Formulario no valido');
      return;
    }

    swal.fire({
      title: 'Espere',
      text: 'Guardando informacion',
      icon: 'info',
      allowOutsideClick: false
    });
    swal.showLoading();

    let peticion: Observable<any>;

    if (this.heroe.id){
      peticion = this.heroesService.actualizarHeroe(this.heroe);
    } else{
      peticion = this.heroesService.crearHeroe(this.heroe);
    }

    peticion.subscribe(resp => {
      swal.fire({
        title: this.heroe.nombre,
        text: 'Se actualizo correctamente',
        icon: 'success'
      });
    });
    this.router.navigate(['/heroes']);
  }

}
