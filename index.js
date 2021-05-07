// imports necessários para ler linhas e ler arquivos
const readline = require("readline");
const fs = require('fs')

// abrindo a interface para ler do terminal
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// interface principal com o usuário, na qual ele escolhe o modo de uso do programa
rl.question("Bem vindo ao Jogo da Vida!\nEscolha entre o modo por arquivo(A) ou modo randômico(R): ", function(modo) {
    rl.question("Digite o número de iterações máxima: ", function(i) {
        if(modo == "A"){
            modo_arquivo(rl, i);
        }else if(modo == "R"){
            modo_randomico(rl, i);
        }else{
            console.warn("O modo não foi reconhecido.");
            rl.close();
        }
    }); 
});

// no modo arquivo, o usuário fornecerá um arquivo(entrada.txt) com uma grade de números,
// com colunas separadas por espaços e linhas separadas por quebras de linha
const modo_arquivo = (rl, i) => {
    try {
        const lines = fs.readFileSync('entrada.txt').toString().split("\n");
        const estado_inicial = [...Array(parseInt(lines.length))].map((_, index) => lines[index].split(" ").map(str => parseInt(str)));
        console.warn(estado_inicial);
        console.warn(`${iterador(estado_inicial, null, i, 0)} iterações`);
        rl.close();
    } catch (err) {
        console.error(err)
    }
}

// no modo randômico, o usuário escolhe a quantidade de linha e de colunas da grade
const modo_randomico = (rl, i) => {
    rl.question("Digite o número de linhas: ", function(n_linhas) {
        rl.question("Digite o número de colunas: ", function(n_colunas) {
            jogo_da_vida_randomico(n_linhas, n_colunas, i);
            rl.close();
        });
    });
}

// essa função recebe a grade como parâmetro, calcula o próximo estado de cada elemento, e retorna uma nova grade
const passo = grade => grade.map((linha, i) => linha.map((celula, j) => proximo_estado(grade, grade[i][j], 0, 0, 0, i, j, i-1, j-1)));

// essa função efetivamente retorna o próximo estado baseado na quantidade de células vivas e zumbis adjacentes
const transforma_estado = (atual, vivos, zumbis) => {
    if(atual == 0 && vivos == 3) return 1;
    if(atual == 1 && zumbis > 0) return 2;
    if(atual == 1 && vivos < 2 && zumbis == 0) return 0;
    if(atual == 1 && vivos > 3 && zumbis == 0) return 0;
    if(atual == 2 && vivos == 0) return 0;
    return atual;
}

// essa função, por meio de suas chamadas recursivas, percorre todos os vizinhos da célula
// atual e retorna qual será o próximo estado
const proximo_estado = (grade, atual, vivos, mortos, zumbis, i_inicial, j_inicial, i, j) => {
    if(i > i_inicial+1 || i == grade.length) {
        return transforma_estado(atual, vivos, zumbis);
    }
    if(i < 0) return proximo_estado(
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
    if(j < 0) return proximo_estado(
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
    if(j == grade[0].length) return proximo_estado(
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
    if(j == j_inicial && i == i_inicial) return proximo_estado(
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
    if(j > j_inicial) return proximo_estado(
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
    else return proximo_estado(
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

// essa função verifica se uma linha é igual a outra
const equal_list = (lis1, lis2) => !lis1.map((elemento, index) => lis2[index] == elemento).includes(false)

// essa função verifica se uma grade é igual a outra
const equal_grade = (grade, grade2) => !grade.map((elemento, index) => equal_list(elemento, grade2[index]) ).includes(false)

// essa função realiza efetivamente as iterações na grade, parando ou quando o sistema
// estabiliza, ou quando o número máximo de iterações foi alcançado
const iterador = (grade_atual, grade_anterior, max_iteracoes, iteracao_atual) => {
    if(iteracao_atual == max_iteracoes){
        console.warn(grade_atual);
        console.warn("A grade chegou ao número de iterações máximo!");
        return iteracao_atual;
    }
    if(grade_anterior != null && equal_grade(grade_atual, grade_anterior)){
        console.warn(grade_atual);
        console.warn("A grade foi estabilizada!");
        return iteracao_atual;
    }
    return iterador(passo(grade_atual), grade_atual, max_iteracoes, iteracao_atual+1);
}

// essa função centraliza a lógica do modo randômico
const jogo_da_vida_randomico = (linhas, colunas, i) => {
    const estado_inicial = inicializa_grade(linhas, colunas);
    console.warn(estado_inicial);
    console.warn(`${iterador(estado_inicial, null, i, 0)} iterações`);
}

// essa função gera um número aleatório, dentro de um certo intervalo. OBS: função impura.
const gera_aleatorio = (min, max) => ~~(Math.random() * (max - min + 1)) + min;

// essa função inicializa a grade com i linhas e j colunas e valores aleatórios
const inicializa_grade = (i, j) => [...Array(parseInt(i))].map(() => [...Array(parseInt(j))].map(() => inicializa_ponto()))

// essa função inicializa um ponto aleatório
const inicializa_ponto = () => gera_aleatorio(0, 2);

// esse callback serve para encerrar o programa da forma correta
rl.on("close", function() {
    console.log("\nFim do programa");
    process.exit(0);
});