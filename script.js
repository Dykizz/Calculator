const calculator = document.querySelector(".calculator");
const input = calculator.querySelector("input");

const checkSyntax = (syntax) => {
    let stack = [];
    for (let i = 0; i < syntax.length; i++) {
        if (syntax[i] == "(") stack.push("(");
        else if (syntax[i] == ")") {
            if (stack.length == 0) return false;
            stack.splice(stack.length - 1);
        }
    }
    return stack.length == 0;
}

const calc = (expression) => {
    try {
        // Thay thế ký tự "÷" bằng "/"
        expression = expression.replace(/÷/g, '/');
        // Thay thế ký tự "x" bằng "*"
        expression = expression.replace(/x/g, '*');

        // Thay thế ký tự "%" bằng "/100"
        expression = expression.replace(/(\d+)%/g, '($1 / 100)'); // Thay thế số phần trăm bằng số chia cho 100

        // Tính toán biểu thức
        const result = eval(expression);

        // Kiểm tra kết quả có phải là số hay không
        return isFinite(result) ? result : false;
    } catch (error) {
        return undefined; // Trả về undefined nếu có lỗi
    }
}
let statusError = { value: false }; // Sử dụng đối tượng để lưu trạng thái

const inputHandle = (input, statusError) => {
    const check = checkSyntax(input.value);
    if (!check) {
        statusError.value = true; // Cập nhật thuộc tính của đối tượng
        return input.value = "SYNTAX ERROR";
    }

    const ans = calc(input.value);
    if (ans === false) {
        statusError.value = true; // Cập nhật thuộc tính của đối tượng
        input.classList.add('status-error');
        input.previousElementSibling.classList.remove('d-none');
        return input.value = "MATH ERROR";
    } 
    if (!ans) {
        statusError.value = true; // Cập nhật thuộc tính của đối tượng
        input.classList.add('status-error');
        input.previousElementSibling.classList.remove('d-none');
        return input.value = "SYNTAX ERROR";
    }

    input.value = ans; // Cập nhật giá trị input
}

// Button
const buttons = calculator.querySelectorAll("button");
buttons.forEach(btn => {
    btn.addEventListener("mousedown", () => {
        btn.classList.add("large-font");
    });
    btn.addEventListener("mouseup", () => {
        btn.classList.add("xlarge-font");
    });
    btn.addEventListener("click", () => {
        if (statusError.value) { // Kiểm tra thuộc tính
            input.value = "";
            statusError.value = false; // Cập nhật thuộc tính
            input.classList.remove('status-error');
            input.previousElementSibling.classList.add('d-none');
        } 
        if (!isNaN(parseInt(btn.value)) || ["%", "(", ")", "."].includes(btn.value)) {
            input.value += btn.value;
        } else if (btn.value == "C") {
            input.value = "";
        } else if (["+", "-", "x", "÷"].includes(btn.value)) {
            const c = input.value[input.value.length - 1];
            if (["+", "-", "x", "÷"].includes(c)) {
                input.value = input.value.slice(0, -1) + btn.value;
            } else {
                input.value += btn.value;
            }
        } else {
            inputHandle(input, statusError);
        }
    });
});


// Input    
input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter'){
        inputHandle(input,statusError);
    }
})
