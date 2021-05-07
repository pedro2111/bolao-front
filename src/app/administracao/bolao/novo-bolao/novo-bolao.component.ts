import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { NotificationService } from 'src/app/core/service/notification.service';
import { BolaoService } from 'src/app/core/service/bolao.service';
import { Bolao } from 'src/app/core/models/bolao.model';
import { CampeonatoService } from 'src/app/core/service/campeonato.service';
import { BolaoCriterio } from 'src/app/core/models/bolaoCriterio.model';
import { BolaoCriterioService } from 'src/app/core/service/bolao-criterio.service';

import * as moment from 'moment';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FileInput } from 'ngx-material-file-input';
import { BolaoParticipante } from 'src/app/core/models/bolaoParticipante.model';
import { BolaoParticipanteService } from 'src/app/core/service/bolao-participante.service';

@Component({
  selector: 'app-novo-bolao',
  templateUrl: './novo-bolao.component.html',
  styleUrls: ['./novo-bolao.component.sass']
})
export class NovoBolaoComponent implements OnInit {

  isLinear = true;
  form1: FormGroup;
  form2: FormGroup;
  formPE = new FormControl();
  formRCG = new FormControl();
  formRC = new FormControl();
  formGE = new FormControl();
  formCampeao = new FormControl();
  formVice = new FormControl();
  formTerceiro = new FormControl();
  formQuarto = new FormControl();
  formDtPalpiteExtra = new FormControl('', [Validators.minLength(9)]);

  criador = localStorage.getItem('usuarioId');
  formData = new FormData();
  imagem: File;
  bolao_id;
  bolaoEditId;
  campeonatos;
  bolao: Bolao;
  bolaoParticipantes;

 
  constructor(
    private formBuilder: FormBuilder,
    private bolaoService: BolaoService,
    private campeonatoService: CampeonatoService,
    private bcService: BolaoCriterioService,
    private bpService:BolaoParticipanteService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {

      this.route.paramMap.subscribe((param) => {

      this.bolaoEditId = param.get('id');
      

      if (param.get('id') != undefined) {
        this.isLinear = false;
        this.bolao_id = this.bolaoEditId;
        this.listarCriterios(this.bolaoEditId);      
        this.listarBolaoParticipantes(this.bolaoEditId);

        this.bolaoService.listarBolaoById(this.bolaoEditId).subscribe(
          (res: Bolao) => {
            this.carregaForm(res),
              this.bolao = res

          }, (err) => {
            console.log(err)
          }
        )
      }
    });

    this.campeonatoService.listarTodosCampeonatosAtivos().subscribe(
      (res) => {
        this.campeonatos = res;
      }, (err) => {
        console.log(err)
      });

    this.initForms();
  }

  listarBolaoParticipantes(bolaoId) {
    this.bpService.listarBolaoParticipantes(bolaoId).subscribe(
      (res) => {
        this.bolaoParticipantes = res;
      },(err) => {
        console.log(err)
      });  
  }
  ativarParticipante(idParticipante){
    this.bpService.ativarToggle(idParticipante).subscribe(
      () => {},
      (err) => {
        console.log(err)
      })

  }

  onFileSelect(event) {
    //console.log('event imagem' + event)
    if (event.target.files.length > 0) {
      this.imagem = event.target.files[0],
        this.form2.get('imagem').setValue(event.target.files[0])
    }
  }

  cadastrar() {

    let bolao: Bolao = this.form1.getRawValue();
    console.log(bolao)


    if (this.bolaoEditId == undefined) {
      this.bolaoService.cadastrar(bolao).subscribe(
        (res: Bolao) => {
          this.bolao_id = res.id,
            this.listarCriterios(res.id),
            this.listarBolaoParticipantes(res.id);
            this.notificationService.showNotification('snackbar-success', 'Bolão cadastrado com sucesso!', 'top', 'right');

        }, (err) => {
          console.log(err)
        });

    } else {
      this.bolaoService.atualizar(this.bolaoEditId, bolao).subscribe(
        (res) => {
          this.bolao_id = this.bolaoEditId,
            this.notificationService.showNotification('snackbar-success', 'Bolão atualizado com sucesso!', 'top', 'right')

        }, (err) => {
          console.log(err)
        });
    }

  }
  uploadCapa() {
    if (this.form2.get('imagem').value != '') {

      const file_form: FileInput = this.form2.get('imagem').value;

      const file = file_form.files[0];

      if (this.bolaoEditId == undefined) {
        this.formData.append('bolao_id', this.bolao_id)

      } else {
        this.formData.append('bolao_id', this.bolaoEditId)
      }

      this.formData.append('imagem', file)
      if (this.bolaoEditId == undefined) {
        this.formData.append('acao', 'cadastrar');
      } else {
        this.formData.append('acao', 'editar');
      }

      this.bolaoService.uploadCapaBolao(this.formData).subscribe(
        (res) => {
          this.notificationService.showNotification('snackbar-success', 'Imagem adicionada com sucesso!', 'top', 'right')
          setTimeout(() => {
            this.router.navigate(['/administracao/bolao']);
          }, 2000)
        }, (err) => {
          this.notificationService.showNotification('snackbar-danger', 'Falha ao carregar a imagem! Tente novamente.', 'top', 'right')
          console.log(err)
        })
    }

  }
  cadastrarCriterios(criterioId, event) {

    let bc = new BolaoCriterio();
    let pontuacao = event.target.value

    if (pontuacao) {

      bc.bolao_id = this.bolao_id;
      bc.criterio_id = criterioId;
      bc.pontuacao = pontuacao;

      this.bcService.cadastrar(bc).subscribe(
        (res) => {

        }, (err) => {
          console.log(err)
        })

    }

  }
  cadastrarDtPalpiteExtra(event) {

    let dtPalpiteExtra:string = event.target.value;

    if (dtPalpiteExtra.length == 16) {
      
      let dtFormat = moment(dtPalpiteExtra, 'DD-MM-YYYY hh:mm');
      let bolao = new Bolao();

      bolao.dtLimitePalpiteExtra = dtFormat.format('YYYY-MM-DD HH:mm');

      this.bolaoService.atualizarDtPalpiteExtra(this.bolao_id, bolao).subscribe(
        (res) => {

        }, (err) => {
          console.log(err)
        });

    }



  }

  carregaForm(bolao: Bolao) {
    this.form1.patchValue({
      nome: bolao.nome,
      descricao: bolao.descricao,
      campeonato_id: bolao.idCampeonato,
      nomeCampeonato: bolao.nomeCampeonato,
      tipoBolao: bolao.tipoBolao
    });
    let dtPalpiteExtra = moment(bolao.dtLimitePalpiteExtra, "YYYY-MM-DD HH:mm").format("DD-MM-YYYY HH:mm")
    this.formDtPalpiteExtra.setValue(dtPalpiteExtra);

  }
  listarCriterios(bolaoId) {
    this.bcService.listarCriteriosBolao(bolaoId).subscribe(
      (res: BolaoCriterio[]) => {
        this.carregaCriterios(res)
      }, (err) => {
        console.log(err)
      })
  }
  carregaCriterios(bc: BolaoCriterio[]) {

    bc.forEach(b => {
      if (b.nomeCriterio == 'PE') {
        this.formPE.setValue(b.pontuacao)
      }
      if (b.nomeCriterio == 'RCG') {
        this.formRCG.setValue(b.pontuacao)
      }
      if (b.nomeCriterio == 'RC') {
        this.formRC.setValue(b.pontuacao)
      }
      if (b.nomeCriterio == 'GE') {
        this.formGE.setValue(b.pontuacao)
      }
      if (b.nomeCriterio == 'CAMPEAO') {
        this.formCampeao.setValue(b.pontuacao)
      }
      if (b.nomeCriterio == 'VICE') {
        this.formVice.setValue(b.pontuacao)
      }
      if (b.nomeCriterio == 'TERCEIRO') {
        this.formTerceiro.setValue(b.pontuacao)
      }
      if (b.nomeCriterio == 'QUARTO') {
        this.formQuarto.setValue(b.pontuacao)
      }

    })

  }

  reset() {
    this.form1.reset();
    this.form2.reset();
    this.initForms();

  }

  initForms() {
    let bolaoId;
    if (this.bolaoEditId == undefined) {
      bolaoId = this.bolao_id;
    } else {
      bolaoId = this.bolaoEditId;
    }

    this.form1 = this.formBuilder.group({
      usuario_id: [this.criador],
      campeonato_id: ['', Validators.required],
      nome: ['', Validators.required],
      descricao: ['', Validators.required],
      nomeCampeonato: [''],
      tipoBolao: ['', Validators.required],
      url: [''],

    });

    this.form2 = this.formBuilder.group({
      imagem: ['']
    });

  }
}
