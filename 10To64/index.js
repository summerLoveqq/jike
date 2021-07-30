/**
 * 第 1 位：符号位，0 代表正数，1代表负数
 * 第 2 位开始存储整数部分
 * 如果有小数，存储一个 「.」
 * 后面开始存储小数部分，最多存储 20 位
 */

const maxFloatCount = 20;
const spltSymbol = '.';
const codeList = '0123456789abcdefghigklmnopqrstuvwxyzABCDEFGHIGKLMNOPQRSTUVWXYZ-~'.split('');
const _64 = 64;
const _10 = 10;

class Convert {
    instanceValue
    baseBinary
    _64Binary
    _10Binary
    constructor(number, binary = _10) {
        this.init(number, binary);
    }
    init(number, binary) {
        if (binary !== _10 && binary !== _64) throw 'PARAM ERROR';
        this.instanceValue = number;
        this.baseBinary = binary;
        if (this.baseBinary === 10) {
            this._10Binary = this.instanceValue
            this._64Binary = null
        } else {
            this._64Binary = this.instanceValue
            this._10Binary = null
        }
    }
    setValue(value, binary = _10) {
        this.init(value, binary)
    }
    get10Binary() {
        if (this._10Binary !== null) return this._10Binary;
        let [integerPart = '', floatPart = ''] = this.instanceValue.split(spltSymbol);
        let symbol = integerPart.slice(0);
        integerPart = integerPart.slice(1).split('').reverse();
        let result = 0, integerValue = 0, floatValue = 0;
        // 整数部分转换
        const len = integerPart.length;
        for (let i = 0; i < len; i++) {
            let value = integerPart[i];
            const index = codeList.findIndex(item => item === value);
            if (index === -1) throw 'INVALID INPUT';
            integerValue += Math.pow(64, i) * index;
        }
        result += integerValue
        // 小数部分转换
        floatPart = floatPart.split('');
        const floatLen = floatPart.length;
        for (let i = 0; i < floatLen; i++) {
            let value = floatPart[i];
            const index = codeList.findIndex(item => item === value);
            if (index === -1) throw 'INVALID INPUT';
            floatValue += Math.pow(64, - (i + 1)) * index;
        }
        result += floatValue;
        this._10Binary = result;
        return symbol === '0' ? result : 0 - result
    }
    get64Binary() {
        if (this._64Binary !== null) return this._64Binary;
        const absValue = Math.abs(this.instanceValue);
        let integerPart = parseInt(absValue);
        let floatPart = absValue - integerPart;
        let result = this.instanceValue > 0 ? '0' : '1';
        // 整数部分
        let integerValue = '';
        while(true) {
            if (integerPart <= 0) break;
            let v = integerPart % 64;
            integerValue = codeList[v] + integerValue;
            integerPart = ~~(integerPart / 64);
        }
        result += integerValue;
        // 添加整数小数分隔符
        result += spltSymbol;
        // 小数部分
        let floatValue = '';
        let currentCount = 0;
        while(true) {
            currentCount++;
            if (currentCount > maxFloatCount) break;
            if (floatValue === 0) break;
            let curRes = floatPart * 64;
            let v = parseInt(curRes);
            floatValue += codeList[v];
            floatPart = curRes -  v;
        }
        result += floatValue;
        this._64Binary = result;
        return result;
    }
}

const instance = new Convert(129.623289, 10);
console.log(instance.get64Binary())
const instance2 = new Convert('021.DU~ubLgw000000000000', 64);
console.log(instance2.get10Binary())