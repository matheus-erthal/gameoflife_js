const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const ESTADO = ["MORTO", "VIVO", "ZUMBI"]

const gera_aleatorio = (min, max) => ~~(Math.random() * (max - min + 1)) + min;

const inicializa_grade = (i, j) => [...Array(parseInt(i))].map(() => [...Array(parseInt(j))].map(() => inicializa_ponto()))

const inicializa_ponto = () => gera_aleatorio(0, 2);

const passo = grade => grade.map(linha => linha.map(celula => celula));

const proximo_estado = (grade, i, j) => {
    const estado_atual = grade[i][j];

}

const jogo_da_vida = (linhas, colunas, i) => {
    console.log(`linhas: ${linhas} colunas: ${colunas} iterações: ${i}`);
    const estado_inicial = inicializa_grade(linhas, colunas);
    console.warn(passo(estado_inicial));
}

rl.question("Digite o número de linhas: ", function(n_linhas) {
    rl.question("Digite o número de colunas: ", function(n_colunas) {
        rl.question("Digite o número de iterações: ", function(i) {
            jogo_da_vida(n_linhas, n_colunas, i);
            rl.close(); 
        });
    });
});

rl.on("close", function() {
    console.log("\nFim do programa");
    process.exit(0);
});

[
    [0,0,0,0,0],
    0,1,1,0,0,
    0,1,0,1,0,
    0,0,1,1,0,
    0,0,0,0,0
]