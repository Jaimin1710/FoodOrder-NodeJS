"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateDeliveryUserInput = exports.OrderInput = exports.CartItem = exports.EditCustomerProfileInput = exports.LoginCustomerInput = exports.CreateCustomerInput = void 0;
const class_validator_1 = require("class-validator");
class CreateCustomerInput {
}
exports.CreateCustomerInput = CreateCustomerInput;
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateCustomerInput.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.Length)(7, 12),
    __metadata("design:type", String)
], CreateCustomerInput.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.Length)(6, 12),
    __metadata("design:type", String)
], CreateCustomerInput.prototype, "password", void 0);
class LoginCustomerInput {
}
exports.LoginCustomerInput = LoginCustomerInput;
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], LoginCustomerInput.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.Length)(6, 12),
    __metadata("design:type", String)
], LoginCustomerInput.prototype, "password", void 0);
class EditCustomerProfileInput {
}
exports.EditCustomerProfileInput = EditCustomerProfileInput;
__decorate([
    (0, class_validator_1.Length)(2, 20),
    __metadata("design:type", String)
], EditCustomerProfileInput.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.Length)(2, 20),
    __metadata("design:type", String)
], EditCustomerProfileInput.prototype, "lastName", void 0);
__decorate([
    (0, class_validator_1.Length)(5, 100),
    __metadata("design:type", String)
], EditCustomerProfileInput.prototype, "address", void 0);
class CartItem {
}
exports.CartItem = CartItem;
class OrderInput {
}
exports.OrderInput = OrderInput;
class CreateDeliveryUserInput {
}
exports.CreateDeliveryUserInput = CreateDeliveryUserInput;
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateDeliveryUserInput.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.Length)(1, 12),
    __metadata("design:type", String)
], CreateDeliveryUserInput.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.Length)(1, 12),
    __metadata("design:type", String)
], CreateDeliveryUserInput.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.Length)(1, 12),
    __metadata("design:type", String)
], CreateDeliveryUserInput.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.Length)(1, 12),
    __metadata("design:type", String)
], CreateDeliveryUserInput.prototype, "lastName", void 0);
__decorate([
    (0, class_validator_1.Length)(1, 24),
    __metadata("design:type", String)
], CreateDeliveryUserInput.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.Length)(1, 24),
    __metadata("design:type", String)
], CreateDeliveryUserInput.prototype, "pincode", void 0);
//# sourceMappingURL=Customer.dto.js.map