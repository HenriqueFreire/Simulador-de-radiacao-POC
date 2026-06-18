# 📡 Simulador de Parâmetros Radiológicos

Simulador interativo das variáveis técnicas de exposição em radiologia convencional — **kV**, **mA** e **mAs** — e seus efeitos sobre o feixe de fótons de raios-X.

🔗 **[Abrir o Simulador](https://SEU-USUARIO.github.io/radiologia-simulador/)**

---

## 📚 Fundamentos Teóricos

### O Tubo de Raios-X

O tubo de raios-X é o coração do equipamento. Dentro dele, elétrons são acelerados do **cátodo** (filamento) até o **ânodo** (alvo, geralmente tungstênio). Ao frenarem abruptamente, parte da energia cinética é convertida em fótons de raios-X.

Dois tipos de radiação são produzidos:

- **Bremsstrahlung** ("radiação de freamento"): espectro contínuo, gerado quando elétrons são defletidos pelo campo nuclear do ânodo
- **Radiação Característica**: picos discretos de energia, gerados quando elétrons ejetam elétrons das camadas internas dos átomos do ânodo (para tungstênio: Kα ≈ 59 keV, Kβ ≈ 67 keV)

---

## ⚡ kV — Quilovolts (Tensão do Tubo)

### O que é
A diferença de potencial aplicada entre cátodo e ânodo. Determina a **velocidade** com que os elétrons atravessam o tubo.

### Efeito nos fótons

| Aumentar kV | Consequência |
|---|---|
| ↑ Energia cinética dos elétrons | ↑ Energia máxima dos fótons (Emáx = kV em keV) |
| ↑ Energia dos fótons | ↑ Poder de penetração (maior comprimento de onda) |
| ↑ Penetração | ↓ Contraste da imagem (menos diferença entre tecidos) |
| ↑ kV | ↑ Dose ao paciente (relação ∝ kV²) |

### Regra dos 15 kV
> Aumentar **15 kV** equivale a **dobrar o mAs** em termos de exposição da imagem (enegrecimento do filme ou sinal do detector). Isso permite reduzir mAs e, portanto, dose, mantendo qualidade diagnóstica.

### Faixa clínica típica
- Extremidades: 40–60 kV
- Tórax: 100–130 kV
- Abdome: 70–90 kV
- Crânio: 70–85 kV

---

## 🔋 mA — Miliampères (Corrente do Tubo)

### O que é
A corrente elétrica no filamento do cátodo. Determina a **quantidade de elétrons** emitidos por segundo (efeito termiônico).

### Efeito nos fótons

| Aumentar mA | Consequência |
|---|---|
| ↑ Elétrons emitidos/s | ↑ Número de fótons produzidos por segundo |
| ↑ Quantidade de fótons | ↑ Densidade ótica da imagem |
| ↑ Quantidade de fótons | ↑ Dose ao paciente |
| ~~Energia dos fótons~~ | **Não se altera** — mA não afeta a energia individual |

> **Conceito-chave:** mA controla a **quantidade** de fótons, não a **qualidade** (energia) deles.

---

## ⏱️ mAs — Miliampère-Segundo (Carga Total)

### O que é
Produto da corrente pelo tempo de exposição:

$$\text{mAs} = \text{mA} \times \text{tempo (s)}$$

### Por que é o principal parâmetro de exposição

O mAs representa a **carga elétrica total** entregue ao tubo durante uma exposição. É ele que determina o número total de fótons que chegam ao receptor de imagem.

| Propriedade | Relação com mAs |
|---|---|
| Número de fótons | Proporcional ao mAs |
| Densidade ótica | Proporcional ao mAs |
| Dose ao paciente | Proporcional ao mAs |
| Energia dos fótons | **Independente** do mAs |
| Contraste | **Independente** do mAs |

### Reciprocidade mA × tempo
Diferentes combinações de mA e tempo que resultam no mesmo mAs produzem a **mesma exposição**:

| mA | Tempo | mAs |
|---|---|---|
| 400 mA | 0,05 s | **20 mAs** |
| 200 mA | 0,10 s | **20 mAs** |
| 100 mA | 0,20 s | **20 mAs** |

> ⚠️ A lei da reciprocidade pode falhar em exposições muito longas ou muito curtas com filmes radiográficos convencionais, mas em sistemas digitais costuma ser válida.

---

## 📊 Comparativo Rápido

| Parâmetro | O que controla | Efeito na Qualidade | Efeito na Quantidade | Efeito no Contraste | Efeito na Dose |
|---|---|---|---|---|---|
| **↑ kV** | Energia dos fótons | ↑ Penetração | ↑ leve | ↓ Contraste | ↑↑ (∝ kV²) |
| **↑ mA** | Fótons/segundo | Nenhum | ↑ proporcional | Nenhum | ↑ proporcional |
| **↑ mAs** | Fótons totais | Nenhum | ↑ proporcional | Nenhum | ↑ proporcional |

---

## 🎮 Como Usar o Simulador

1. Ajuste o slider de **kV** para alterar a tensão do tubo
2. Ajuste o slider de **mA** para alterar a corrente
3. Ajuste o **tempo** de exposição
4. Observe em tempo real como os parâmetros afetam o espectro de fótons, a dose e a qualidade da imagem
5. O gráfico mostra o espectro contínuo de Bremsstrahlung e os picos de radiação característica (quando kV ≥ 69 kV para tungstênio)

---

## 🛠️ Tecnologias

- HTML5 + CSS3 + JavaScript (vanilla)
- Canvas API para o espectro
- GitHub Pages para hospedagem

---

## 📖 Referências

- BUSHONG, Stewart C. **Radiologic Science for Technologists**. 11ª ed. Elsevier, 2017.
- Carlton, Richard R.; ADLER, Arlene McKenna. **Principles of Radiographic Imaging**. 5ª ed. Cengage, 2012.
- SPRAWLS, Perry. **Physical Principles of Medical Imaging**. 2ª ed. Medical Physics Publishing, 1995.

---

> Desenvolvido para fins educacionais no curso técnico de radiologia.
