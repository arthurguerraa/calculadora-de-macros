const tabela = document.getElementById("tabela");
const btnLinha = document.getElementById("addLinha");

const totalCarb = document.getElementById("totalCarb");
const totalProt = document.getElementById("totalProt");
const totalGord = document.getElementById("totalGord");
const totalCal = document.getElementById("totalCal");

const btnExportar = document.getElementById("exportar");
const inputImportar = document.getElementById("importar");

// Carrega banco salvo
let alimentos = JSON.parse(localStorage.getItem("alimentos")) || [];

btnExportar.onclick = () => {
  const data = JSON.stringify(alimentos);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "alimentos.json";
  a.click();
};

inputImportar.onchange = e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    alimentos = JSON.parse(reader.result);
    localStorage.setItem("alimentos", JSON.stringify(alimentos));
    alert("Banco de alimentos importado!");
  };
  reader.readAsText(file);
};

btnLinha.onclick = criarLinha;

function criarLinha() {
  if (alimentos.length === 0) {
    alert("Importe um banco de alimentos primeiro!");
    return;
  }

  const tr = document.createElement("tr");

  const tdSelect = document.createElement("td");
  const select = document.createElement("select");

  alimentos.forEach((a, i) => {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = a.nome;
    select.appendChild(option);
  });

  tdSelect.appendChild(select);

  const tdQtd = document.createElement("td");
  const input = document.createElement("input");
  input.type = "number";
  input.value = 100;
  tdQtd.appendChild(input);

  const tdCarb = document.createElement("td");
  const tdProt = document.createElement("td");
  const tdGord = document.createElement("td");

  const tdRemove = document.createElement("td");
  const btnRemover = document.createElement("button");
  btnRemover.textContent = "❌";
  tdRemove.appendChild(btnRemover);

  tr.append(tdSelect, tdQtd, tdCarb, tdProt, tdGord, tdRemove);
  tabela.appendChild(tr);

  function atualizar() {
    const a = alimentos[select.value];
    const q = Number(input.value);

    tdCarb.textContent = (a.carbs * q / 100).toFixed(1);
    tdProt.textContent = (a.proteina * q / 100).toFixed(1);
    tdGord.textContent = (a.gordura * q / 100).toFixed(1);

    calcularTotais();
  }

  btnRemover.onclick = () => {
    tr.remove();
    calcularTotais();
  };

  select.onchange = atualizar;
  input.oninput = atualizar;

  atualizar();
}

function calcularTotais() {
  let c = 0, p = 0, g = 0;

  document.querySelectorAll("#tabela tr").forEach(tr => {
    c += Number(tr.children[2].textContent) || 0;
    p += Number(tr.children[3].textContent) || 0;
    g += Number(tr.children[4].textContent) || 0;
  });

  totalCarb.textContent = c.toFixed(1);
  totalProt.textContent = p.toFixed(1);
  totalGord.textContent = g.toFixed(1);
  totalCal.textContent = (c * 4 + p * 4 + g * 9).toFixed(0);
}
