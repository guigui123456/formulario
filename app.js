// listas de recusa
const cpfsRecusados = ["000.000.000-00", "00000000000"];
const cepsRecusados = ["00000-000" , "00000000"];

// limites de valor por cobertura
const limites = {
  incendio: 1000000,
  furtos: 500000,
  danos: 1500000
};

// mostra mensagem de erro
function mostrarErro(id, msg) {
  document.getElementById(id).innerHTML = msg;
}

// valida o cpf
function validarCpf() {
  const cpf = document.getElementById("cpf").value;

  if (cpf === "") {
    mostrarErro("erroCpf", "Digite o CPF.");
    return false;
  }
  if (cpfsRecusados.includes(cpf)) {
    mostrarErro("erroCpf", "CPF recusado.");
    return false;
  }
  mostrarErro("erroCpf", "");
  return true;
}

// calcula os dias de vigencia
function calcularDias() {
  const inicio = document.getElementById("inicio").value;
  const fim = document.getElementById("fim").value;

  if (inicio !== "" && fim !== "") {
    const d1 = new Date(inicio);
    const d2 = new Date(fim);
    const dias = (d2 - d1) / (1000 * 60 * 60 * 24);
    document.getElementById("dias").value = dias;
  }
}

// valida as datas
function validarDatas() {
  const inicio = document.getElementById("inicio").value;
  const fim = document.getElementById("fim").value;
  let ok = true;

  if (inicio === "") {
    mostrarErro("erroInicio", "Digite a data de inicio.");
    ok = false;
  } else {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const d1 = new Date(inicio);
    if (d1 < hoje) {
      mostrarErro("erroInicio", "Data nao pode ser antes de hoje.");
      ok = false;
    } else {
      mostrarErro("erroInicio", "");
    }
  }

  if (fim === "") {
    mostrarErro("erroFim", "Digite a data de fim.");
    ok = false;
  } else if (inicio !== "") {
    const d1 = new Date(inicio);
    const d2 = new Date(fim);
    const dias = (d2 - d1) / (1000 * 60 * 60 * 24);
    if (dias < 365) {
      mostrarErro("erroFim", "Vigencia deve ter no minimo 365 dias.");
      ok = false;
    } else {
      mostrarErro("erroFim", "");
    }
  }

  return ok;
}

// busca o cep na api
function buscarCep() {
  const cep = document.getElementById("cep").value;

  if (cep === "") {
    return;
  }
  if (cepsRecusados.includes(cep)) {
    mostrarErro("erroCep", "CEP recusado.");
    return;
  }

  // tira o traco so pra chamar a api
  const cepSoNumeros = cep.replace("-", "");

  fetch("https://viacep.com.br/ws/" + cepSoNumeros + "/json/")
    .then(function (resposta) {
      return resposta.json();
    })
    .then(function (dados) {
      if (dados.erro) {
        mostrarErro("erroCep", "CEP nao encontrado.");
        return;
      }
      document.getElementById("estado").value = dados.uf;
      document.getElementById("cidade").value = dados.localidade;
      document.getElementById("logradouro").value = dados.logradouro;
      document.getElementById("bairro").value = dados.bairro;
      mostrarErro("erroCep", "");
    })
    .catch(function () {
      mostrarErro("erroCep", "Erro ao consultar o CEP. Tente novamente.");
    });
}

// valida o valor do premio
function validarPremio() {
  const cobertura = document.getElementById("cobertura").value;
  const premio = document.getElementById("premio").value;

  if (cobertura === "") {
    mostrarErro("erroCobertura", "Escolha uma cobertura.");
    return false;
  }
  mostrarErro("erroCobertura", "");

  if (premio === "") {
    mostrarErro("erroPremio", "Digite o valor do premio.");
    return false;
  }
  if (premio < 5000) {
    mostrarErro("erroPremio", "Valor minimo: R$ 5.000,00.");
    return false;
  }
  if (premio > limites[cobertura]) {
    mostrarErro("erroPremio", "Valor maximo para esta cobertura: R$ " + limites[cobertura] + ",00.");
    return false;
  }
  mostrarErro("erroPremio", "");
  return true;
}

// valida o CEP no envio
function validarCep() {
  const cep = document.getElementById("cep").value;

  if (cep === "") {
    mostrarErro("erroCep", "Digite o CEP.");
    return false;
  }
  if (cepsRecusados.includes(cep)) {
    mostrarErro("erroCep", "CEP recusado.");
    return false;
  }
  return true;
}

// eventos
document.getElementById("cpf").onblur = validarCpf;

document.getElementById("inicio").onchange = function () {
  calcularDias();
  validarDatas();
};
document.getElementById("fim").onchange = function () {
  calcularDias();
  validarDatas();
};

document.getElementById("cep").onblur = buscarCep;

document.getElementById("cobertura").onchange = validarPremio;
document.getElementById("premio").onblur = validarPremio;

// enviar
document.getElementById("formSeguro").onsubmit = function () {
  const nome = document.getElementById("nome").value;

  if (nome === "") {
    mostrarErro("erroNome", "Digite o nome.");
  } else {
    mostrarErro("erroNome", "");
  }

  const cpfOk = validarCpf();
  const datasOk = validarDatas();
  const premioOk = validarPremio();
  const cepOk = validarCep();

  if (nome !== "" && cpfOk && datasOk && premioOk && cepOk) {
    // 1. Mostra a mensagem de parabéns
    alert("Parabéns, solicitação enviada com sucesso!");
    
    // 2. Limpa todos os inputs do formulário
    document.getElementById("formSeguro").reset();
    
    // 3. Limpa todas as mensagens de erro da tela
    document.getElementById("erroNome").innerHTML = "";
    document.getElementById("erroCpf").innerHTML = "";
    document.getElementById("erroInicio").innerHTML = "";
    document.getElementById("erroFim").innerHTML = "";
    document.getElementById("erroCep").innerHTML = "";
    document.getElementById("erroCobertura").innerHTML = "";
    document.getElementById("erroPremio").innerHTML = "";
    
  } else {
    alert("Corrija os campos antes de enviar.");
  }

  return false;
};