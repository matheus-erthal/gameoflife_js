const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const gera_aleatorio = (min, max) => ~~(Math.random() * (max - min + 1)) + min;

const inicializa_grade = (i, j) => [...Array(parseInt(i))].map(() => [...Array(parseInt(j))].map(() => inicializa_ponto()))

const inicializa_ponto = () => gera_aleatorio(0, 2);

const passo = grade => grade.map((linha, i) => linha.map((celula, j) => proximo_estado(grade, i, j)));

const transforma_estado = (atual, vivos, zumbis) => {
    if(atual == 0 && vivos == 3) return 1;
    if(atual == 1 && zumbis > 0) return 2;
    if(atual == 1 && vivos < 2 && zumbis == 0) return 0;
    if(atual == 1 && vivos > 3 && zumbis == 0) return 0;
    if(atual == 2 && vivos == 0) return 0;
    return atual;
}

const proximo_estado_rec = (grade, atual, vivos, mortos, zumbis, i_inicial, j_inicial, i, j) => {
    if(i > i_inicial+1 || i == grade.length) {
        return transforma_estado(atual, vivos, zumbis);
    }
    if(i < 0) return proximo_estado_rec(
        grade, 
        atual, 
        vivos, 
        mortos, 
        zumbis, 
        i_inicial, 
        j_inicial, 
        i+1, 
        j_inicial-1
    );
    if(j < 0) return proximo_estado_rec(
        grade, 
        atual, 
        vivos, 
        mortos, 
        zumbis, 
        i_inicial, 
        j_inicial, 
        i, 
        j+1
    );
    if(j == grade[0].length) return proximo_estado_rec(
        grade, 
        atual, 
        vivos, 
        mortos, 
        zumbis, 
        i_inicial, 
        j_inicial, 
        i + 1, 
        j_inicial - 1
    );
    if(j == j_inicial && i == i_inicial) return proximo_estado_rec(
        grade, 
        atual, 
        vivos, 
        mortos, 
        zumbis, 
        i_inicial, 
        j_inicial, 
        i, 
        j+1
    );
    if(j > j_inicial) return proximo_estado_rec(
        grade, 
        atual, 
        grade[i][j] == 1 ? vivos+1 : vivos, 
        grade[i][j] == 0 ? mortos+1 : mortos, 
        grade[i][j] == 2 ? zumbis+1 : zumbis, 
        i_inicial, 
        j_inicial, 
        i+1, 
        j_inicial-1
    );
    else return proximo_estado_rec(
        grade, 
        atual, 
        grade[i][j] == 1 ? vivos+1 : vivos, 
        grade[i][j] == 0 ? mortos+1 : mortos, 
        grade[i][j] == 2 ? zumbis+1 : zumbis, 
        i_inicial, 
        j_inicial, 
        i, 
        j+1
    );
}

const proximo_estado = (grade, i, j) => {
    const atual = grade[i][j];
    return proximo_estado_rec(grade, atual, 0, 0, 0, i, j, i-1, j-1);

}

const equal_list = (lis) => !lis.map((elemento, index) => passo(lis)[index] == elemento).includes(false)

const equal_grade = (grade) => !grade.map((lis) => equal_list(lis) ).includes(false)

const jogo_da_vida = (linhas, colunas, i) => {
    console.log(`linhas: ${linhas} colunas: ${colunas} iterações: ${i}`);
    const estado_inicial = inicializa_grade(linhas, colunas);
    console.warn(estado_inicial);
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