import FiliacaoController from "../controllers/FiliacaoController";
import FuncionarioController from "../controllers/FuncionarioController";
import LoginController from "../controllers/LoginController";
import PraticanteController from "../controllers/PraticanteController";
import RelatoriosController from "../controllers/RelatoriosController";
import UsuarioController from "../controllers/UsuarioController";
import multerConfig from "../config/multerConfig"
import multerConfig2 from "../config/multerConfig2";
import multer from "multer";
import express from 'express';
import FrequenciaController from "../controllers/FrequenciaController";
import SessionController from "../controllers/SessoesController";
import PontoController from "../controllers/PontoController";
import DespesasController from "../controllers/DespesasController";
import ColaboradoesController from "../controllers/ColaboradoesController";
import MesReferenciaController from "../controllers/MesReferenciaController";
import ReceitasController from "../controllers/ReceitasController";
import { downloadReport } from "../controllers/download";
import { viewReport } from "../controllers/visualizar";
const router = express.Router();

const uploadImage = multer(multerConfig);
const upload = multer(multerConfig2);
//login
router.post('/login', LoginController.store);
//usruarios
router.get('/usuarios', UsuarioController.index);
router.post('/usuarios', UsuarioController.store);
router.get('/usuarios/:id', UsuarioController.show);
router.get('/usuariosBusca/search', UsuarioController.search);
router.get('/usuario/:id', UsuarioController.showUserbyId);
router.put('/usuarios/:id', uploadImage.single('image'), UsuarioController.update);
router.delete('/usuarios/:id', UsuarioController.delete);

//praticantes
router.get('/praticantes', PraticanteController.index);
router.get('/praticantes/:id', PraticanteController.show);
router.get('/praticanteRelated/:id', PraticanteController.showRelatedProfile);
router.delete('/praticantes/:id', PraticanteController.delete);
router.get('/praticantesBusca/search', PraticanteController.search);
router.get('/praticantes', PraticanteController.index);
router.get('/praticantes/:id', PraticanteController.show);
router.get('/praticantesRelated/:id', PraticanteController.showbyFisioid);
router.put('/praticantes/:id', uploadImage.single('image'), PraticanteController.update);
router.post('/praticantes', PraticanteController.store);
router.delete('/praticantes/:id', PraticanteController.delete);
//Sessões
router.get('/sessoes', SessionController.index);
router.delete('/sessoes/:id', SessionController.delete);
router.get('/sessao/:id', SessionController.show);
router.get('/sessaoPraticante/:id', SessionController.showbypraticante);
router.post('/sessoes', SessionController.store);
router.put('/sessoes/:id', SessionController.update);
//filiacao \ responsavel
router.get('/filiacao', FiliacaoController.index);
router.get('/filiacao/:id', FiliacaoController.show);
router.post('/filiacao', FiliacaoController.store);
router.delete('/filiacao/:id', FiliacaoController.delete);
router.put('/filiacao/:id', FiliacaoController.update);
//funcionarios
router.post('/funcionarios', FuncionarioController.store);
router.get('/funcionarios', FuncionarioController.index);
router.get('/funcionarios/:id', FuncionarioController.show);
router.put('/funcionarios/:id', uploadImage.single('image'), FuncionarioController.update);
router.get('/funcionar                                          ioBusca/search', FuncionarioController.search);
router.get('/funcionarioRelated/:id', FuncionarioController.showRelatedProfile);
router.delete('/funcionarios/:id', FuncionarioController.delete);
//relatorios
router.get('/funcionarios/:id/reports', RelatoriosController.show);
router.get('/reportsBusca/search', RelatoriosController.search);
router.get('/relatorios', RelatoriosController.index);
router.get('/relatorios/:id', RelatoriosController.showById);
router.get('/relatorio/:id', RelatoriosController.showByIdReport);
router.post('/relatorios', RelatoriosController.store);
router.get("/relatorios/visualizar/:id", RelatoriosController.visualizar);
router.get('/relatorio/download/:id', RelatoriosController.download);
router.put('/relatorios/:id', RelatoriosController.update);
router.delete('/relatorios/:id', RelatoriosController.delete);
// download de relatorios
router.get("/download/:filename", downloadReport);
// visualizar relatorios
router.get("/visualizar/:filename", viewReport);
//frequencia
router.get('/frequencia', FrequenciaController.index);
router.get("/frequencia/semestral/:id", FrequenciaController.frequenciaMensal);
router.get('/frequencia/:id', FrequenciaController.show);
router.get('/frequenciapraticante/:id', FrequenciaController.indexById)
router.post('/frequencia', FrequenciaController.store);
router.delete('/frequencia/:id', FrequenciaController.delete);
router.get('/frequencia/relatorio', FrequenciaController.relatorio);

//rotas de admin
router.get('/despesas', DespesasController.index);
router.post('/despesas', DespesasController.store);
router.get('/despesas/:id', DespesasController.show);
router.put('/despesas/:id', DespesasController.update);
router.delete('/despesas/:id', DespesasController.delete);
router.get('/despesasBusca/search', DespesasController.search);
router.get('/colaboradores', ColaboradoesController.index);
router.get('/colaboradores/:id', ColaboradoesController.show);
router.post('/colaboradores', ColaboradoesController.store);
router.put('/colaboradores/:id', ColaboradoesController.update);
router.delete('/colaboradores/:id', ColaboradoesController.delete);
router.get('/mesref/', MesReferenciaController.index)
router.get('/mesref/:id', MesReferenciaController.show);
router.post('/mesref', MesReferenciaController.store);
router.put('/mesref/:id', MesReferenciaController.update);
router.delete('/mesref/:id', MesReferenciaController.delete);
router.get('/recitas', ReceitasController.index);
router.get('/recitas/:id', ReceitasController.show);
router.post('/recitas', ReceitasController.store);
router.put('/recitas/:id', ReceitasController.update);
router.delete('/recitas/:id', ReceitasController.delete);
//bater ponto
router.post('/ponto', PontoController.store);
router.get('/ponto', PontoController.index);
router.post('/auth/digital', FuncionarioController.verifyDigital);

export default router;


