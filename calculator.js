// 아크패시브 선택 제한 검증
function validateTierSelection(tierClass, maxCount) {
    const selects = document.querySelectorAll(`.${tierClass}`);
    let count = 0;
    
    selects.forEach(select => {
        if (select.tagName === 'SELECT') {
            if (parseInt(select.value) > 0) count++;
        } else if (select.type === 'checkbox' && select.checked) {
            count++;
        }
    });
    
    return count <= maxCount;
}

// 2티어 선택 제한 (최대 3개)
document.querySelectorAll('.tier2').forEach(select => {
    select.addEventListener('change', function() {
        if (!validateTierSelection('tier2', 3)) {
            alert('2티어는 최대 3개까지 선택 가능합니다.');
            this.value = '0';
        }
    });
});

// 3티어 선택 제한 (최대 2개)
document.querySelectorAll('.tier3').forEach(select => {
    select.addEventListener('change', function() {
        if (!validateTierSelection('tier3', 2)) {
            alert('3티어는 최대 2개까지 선택 가능합니다.');
            this.value = '0';
        }
    });
});

// 4티어 선택 제한 (최대 2개, 중복 없음)
document.querySelectorAll('.tier4').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        if (!validateTierSelection('tier4', 2)) {
            alert('4티어 엘릭서는 최대 2개까지 선택 가능합니다.');
            this.checked = false;
        }
    });
});

// 아크패시브 값 가져오기
function getArkPassiveValues() {
    const values = {
        tier2: {},
        tier3: {},
        tier4: {},
        tier5: null
    };
    
    // 2티어
    document.querySelectorAll('.tier2').forEach(select => {
        const passive = select.dataset.passive;
        values.tier2[passive] = parseInt(select.value);
    });
    
    // 3티어
    document.querySelectorAll('.tier3').forEach(select => {
        const passive = select.dataset.passive;
        values.tier3[passive] = parseInt(select.value);
    });
    
    // 4티어
    document.querySelectorAll('.tier4').forEach(checkbox => {
        const passive = checkbox.dataset.passive;
        values.tier4[passive] = checkbox.checked;
    });
    
    // 5티어
    document.querySelectorAll('.tier5').forEach(radio => {
        if (radio.checked) {
            values.tier5 = radio.dataset.passive;
        }
    });
    
    return values;
}

// 치명타 적중률 계산
function calculateCritRate(arkValues) {
    let critRate = 0;
    
    // 기본 입력값
    const critStat = parseFloat(document.getElementById('crit-stat').value) || 0;
    critRate += critStat * 0.03578;
    
    critRate += parseFloat(document.getElementById('adrenaline').value) || 0;
    critRate += parseFloat(document.getElementById('crit-synergy').value) || 0;
    critRate += parseFloat(document.getElementById('ring-crit-rate').value) || 0;
    critRate += parseFloat(document.getElementById('bracelet-crit-rate').value) || 0;
    critRate += parseFloat(document.getElementById('character-crit-rate').value) || 0;
    
    // 아크패시브 - 예리한 감각
    if (arkValues.tier2['sharp-sense'] === 1) critRate += 4;
    if (arkValues.tier2['sharp-sense'] === 2) critRate += 8;
    
    // 아크패시브 - 혼신의 강타
    if (arkValues.tier3['full-power'] === 1) critRate += 12;
    if (arkValues.tier3['full-power'] === 2) critRate += 24;
    
    // 아크패시브 - 일격
    if (arkValues.tier3['one-strike'] === 1) critRate += 10;
    if (arkValues.tier3['one-strike'] === 2) critRate += 20;
    
    // 아크패시브 - 달인
    if (arkValues.tier4['master']) critRate += 7;
    
    return critRate; // 원본 치적 그대로 반환
}

// 치명타 피해량 계산
function calculateCritDamage(arkValues) {
    let critDamage = 200; // 기본 200%
    
    critDamage += parseFloat(document.getElementById('character-crit-damage').value) || 0;
    critDamage += parseFloat(document.getElementById('ring-crit-damage').value) || 0;
    critDamage += parseFloat(document.getElementById('bracelet-crit-damage').value) || 0;
    critDamage += parseFloat(document.getElementById('keen-crit-damage').value) || 0;
    
    // 아크패시브 - 일격
    if (arkValues.tier3['one-strike'] === 1) critDamage += 16;
    if (arkValues.tier3['one-strike'] === 2) critDamage += 32;
    
    return critDamage / 100; // 200% = 2.0배로 변환
}

// 추가 피해 계산
function calculateAdditionalDamage(arkValues) {
    let additionalDamage = 0;
    
    additionalDamage += parseFloat(document.getElementById('weapon-additional').value) || 0;
    additionalDamage += parseFloat(document.getElementById('necklace-additional').value) || 0;
    
    // 아크패시브 - 달인
    if (arkValues.tier4['master']) additionalDamage += 8.5;
    
    return 1 + (additionalDamage / 100);
}

// 진화형 피해 계산
function calculateEvolutionDamage(arkValues) {
    let evolutionDamage = 0;
    
    // 서폿 유무
    if (document.getElementById('support-exists').checked) evolutionDamage += 14;
    
    // 진화 카르마
    evolutionDamage += parseFloat(document.getElementById('karma-rank').value) || 0;
    
    // 2티어 아크패시브
    if (arkValues.tier2['forbidden-spell'] === 1) evolutionDamage += 10;
    if (arkValues.tier2['forbidden-spell'] === 2) evolutionDamage += 20;
    
    if (arkValues.tier2['sharp-sense'] === 1) evolutionDamage += 5;
    if (arkValues.tier2['sharp-sense'] === 2) evolutionDamage += 10;
    
    if (arkValues.tier2['breakthrough'] === 1) evolutionDamage += 10;
    if (arkValues.tier2['breakthrough'] === 2) evolutionDamage += 20;
    if (arkValues.tier2['breakthrough'] === 3) evolutionDamage += 30;
    
    if (arkValues.tier2['optimization'] === 1) evolutionDamage += 5;
    if (arkValues.tier2['optimization'] === 2) evolutionDamage += 10;
    
    // 3티어 아크패시브
    if (arkValues.tier3['infinite-mana'] === 1) evolutionDamage += 8;
    if (arkValues.tier3['infinite-mana'] === 2) evolutionDamage += 16;
    
    if (arkValues.tier3['full-power'] === 1) evolutionDamage += 2;
    if (arkValues.tier3['full-power'] === 2) evolutionDamage += 4;
    
    if (arkValues.tier3['destruction-tank'] === 1) evolutionDamage += 12;
    if (arkValues.tier3['destruction-tank'] === 2) evolutionDamage += 24;
    
    if (arkValues.tier3['timing-master'] === 1) evolutionDamage += 8;
    if (arkValues.tier3['timing-master'] === 2) evolutionDamage += 16;
    
    // 4티어 아크패시브
    if (arkValues.tier4['crush']) evolutionDamage += 20;
    
    // 5티어 아크패시브
    if (arkValues.tier5 === 'blunt-thorn') evolutionDamage += 75;
    if (arkValues.tier5 === 'sonic-break') evolutionDamage += 24;
    if (arkValues.tier5 === 'infighting') evolutionDamage += 18;
    if (arkValues.tier5 === 'standing-striker') evolutionDamage += 21;
    if (arkValues.tier5 === 'mana-furnace') evolutionDamage += 24;
    
    return 1 + (evolutionDamage / 100);
}

// 피해량 증가 계산
function calculateDamageIncrease(arkValues) {
    let multiplier = 1;
    
    // 아크패시브 - 회심 (치명타 시 12% 피증)
    if (arkValues.tier4['critical-blow']) {
        multiplier *= 1.12;
    }
    
    return multiplier;
}

// 쿨타임 감소 계산
function calculateCooldownReduction(arkValues) {
    const gemCooldown = (parseFloat(document.getElementById('gem-cooldown').value) || 0) / 100;
    const swiftnessStat = parseFloat(document.getElementById('swiftness-stat').value) || 0;
    const swiftnessCooldown = swiftnessStat * 0.02147 / 100;
    const cooldownEfficiency = (parseFloat(document.getElementById('cooldown-efficiency').value) || 100) / 100;
    
    // 끝없는 마나 + 무한한 마력 (합연산)
    let arkCooldown1 = 0;
    if (arkValues.tier2['endless-mana'] === 1) arkCooldown1 += 7;
    if (arkValues.tier2['endless-mana'] === 2) arkCooldown1 += 14;
    if (arkValues.tier3['infinite-mana'] === 1) arkCooldown1 += 7;
    if (arkValues.tier3['infinite-mana'] === 2) arkCooldown1 += 14;
    arkCooldown1 /= 100;
    
    // 최적화 훈련
    let optimizationCooldown = 0;
    if (arkValues.tier2['optimization'] === 1) optimizationCooldown = 4;
    if (arkValues.tier2['optimization'] === 2) optimizationCooldown = 8;
    optimizationCooldown /= 100;
    
    // 타이밍 지배
    let timingCooldown = 0;
    if (arkValues.tier3['timing-master'] === 1) timingCooldown = 5;
    if (arkValues.tier3['timing-master'] === 2) timingCooldown = 10;
    timingCooldown /= 100;
    
    // 총 쿨감 (곱연산)
    const totalCooldown = 1 - (1 - gemCooldown) * (1 - swiftnessCooldown) * (1 - arkCooldown1) * (1 - optimizationCooldown) * (1 - timingCooldown);
    
    // 딜 증가율 계산
    const damageIncrease = 1 + (((1 / (1 - totalCooldown)) - 1) * cooldownEfficiency);
    
    return {
        totalCooldown: totalCooldown * 100,
        damageIncrease: damageIncrease
    };
}

// 메인 계산 함수
function calculateDamageExpectation() {
    const arkValues = getArkPassiveValues();
    
    // 각 요소 계산
    const originalCritRate = calculateCritRate(arkValues); // 원본 치적
    
    // 딜 계산에 사용할 치적 결정 (뭉툭한 가시면 80%, 아니면 min(치적, 100))
    let effectiveCritRate;
    if (arkValues.tier5 === 'blunt-thorn') {
        effectiveCritRate = 80;
    } else {
        effectiveCritRate = Math.min(originalCritRate, 100);
    }
    
    const critRate = effectiveCritRate / 100; // 비율로 변환
    const critDamage = calculateCritDamage(arkValues); // 2.0 + 추가 치피
    const additionalDamage = calculateAdditionalDamage(arkValues); // 1 + 추피
    const evolutionDamage = calculateEvolutionDamage(arkValues); // 1 + 진피
    const damageIncrease = calculateDamageIncrease(arkValues); // 회심 피증
    const cooldownResult = calculateCooldownReduction(arkValues);
    
    // 치명타 기댓값 계산: (1 - 치적) + (치적 × 치피 × 회심피증)
    const critExpectation = (1 - critRate) + (critRate * critDamage * damageIncrease);
    
    // 최종 딜 기댓값: 치명기댓값 × 진피 × 추피 × 쿨감딜증
    const finalDamage = critExpectation * evolutionDamage * additionalDamage * cooldownResult.damageIncrease;
    
    // 결과 표시
    displayResults(finalDamage, {
        originalCritRate: originalCritRate, // 원본 치적 (화면에 표시)
        effectiveCritRate: effectiveCritRate, // 실제 계산에 사용된 치적
        isBluntThornActive: arkValues.tier5 === 'blunt-thorn',
        critDamage: critDamage * 100,
        critExpectation: critExpectation,
        additionalDamage: additionalDamage,
        evolutionDamage: evolutionDamage,
        damageIncrease: damageIncrease,
        cooldownReduction: cooldownResult.totalCooldown,
        cooldownDamageIncrease: cooldownResult.damageIncrease
    });
}

// 결과 표시 함수
function displayResults(finalDamage, details) {
    const resultDisplay = document.getElementById('result-display');
    const detailedResult = document.getElementById('detailed-result');
    
    resultDisplay.innerHTML = `딜 기댓값: ${finalDamage.toFixed(4)}`;
    resultDisplay.style.display = 'block';
    
    // 비치명/치명 분해 표시
    const nonCritPortion = (1 - details.effectiveCritRate / 100).toFixed(4);
    const critPortion = ((details.effectiveCritRate / 100) * (details.critDamage / 100) * details.damageIncrease).toFixed(4);
    
    detailedResult.innerHTML = `
        <h3>상세 계산 결과</h3>
        <p>치명타 적중률: ${details.originalCritRate.toFixed(2)}%</p>
        <p>치명타 피해량: ${details.critDamage.toFixed(2)}%</p>
        <p>진화형 피해: ${details.evolutionDamage.toFixed(4)}</p>
        <p>총 쿨감: ${details.cooldownReduction.toFixed(2)}%</p>
        <p>쿨감으로 인한 딜 증가: ${details.cooldownDamageIncrease.toFixed(4)}</p>
        <hr style="margin: 15px 0; border: none; border-top: 1px solid #d0d0c8;">
        <p style="font-weight: bold;">최종 계산식:</p>
        <p style="margin-left: 20px;">((1 - ${(details.effectiveCritRate / 100).toFixed(4)}) + (${(details.effectiveCritRate / 100).toFixed(4)} × ${(details.critDamage / 100).toFixed(4)} × ${details.damageIncrease.toFixed(4)})) × ${details.evolutionDamage.toFixed(4)} × ${details.additionalDamage.toFixed(4)} × ${details.cooldownDamageIncrease.toFixed(4)}</p>
        <p style="font-weight: bold; margin-left: 20px;">= ${finalDamage.toFixed(4)}</p>
    `;
    detailedResult.style.display = 'block';
}

// 계산 버튼 이벤트
document.getElementById('calculate-btn').addEventListener('click', calculateDamageExpectation);
