using FluentValidation;
using IntranetPortal.Application.DTOs.Users;

namespace IntranetPortal.Application.Validators
{
    public class CreateUserDtoValidator : AbstractValidator<CreateUserDto>
    {
        public CreateUserDtoValidator()
        {
            RuleFor(x => x.Ad)
                .NotEmpty().WithMessage("Ad zorunludur.")
                .MaximumLength(50).WithMessage("Ad en fazla 50 karakter olabilir.");

            RuleFor(x => x.Soyad)
                .NotEmpty().WithMessage("Soyad zorunludur.")
                .MaximumLength(50).WithMessage("Soyad en fazla 50 karakter olabilir.");

            RuleFor(x => x.Sicil)
                .NotEmpty().WithMessage("Sicil numarası zorunludur.")
                .MaximumLength(20).WithMessage("Sicil numarası en fazla 20 karakter olabilir.");

            RuleFor(x => x.Sifre)
                .NotEmpty().WithMessage("Şifre zorunludur.")
                .MinimumLength(12).WithMessage("Şifre en az 12 karakter olmalıdır.");
        }
    }

    public class UpdateUserDtoValidator : AbstractValidator<UpdateUserDto>
    {
        public UpdateUserDtoValidator()
        {
            RuleFor(x => x.Ad)
                .NotEmpty().WithMessage("Ad zorunludur.")
                .MaximumLength(50).WithMessage("Ad en fazla 50 karakter olabilir.");

            RuleFor(x => x.Soyad)
                .NotEmpty().WithMessage("Soyad zorunludur.")
                .MaximumLength(50).WithMessage("Soyad en fazla 50 karakter olabilir.");

            RuleFor(x => x.Sicil)
                .NotEmpty().WithMessage("Sicil numarası zorunludur.")
                .MaximumLength(20).WithMessage("Sicil numarası en fazla 20 karakter olabilir.");
        }
    }

    public class ResetPasswordDtoValidator : AbstractValidator<ResetPasswordDto>
    {
        public ResetPasswordDtoValidator()
        {
            RuleFor(x => x.NewPassword)
                .NotEmpty().WithMessage("Yeni şifre zorunludur.")
                .MinimumLength(12).WithMessage("Şifre en az 12 karakter olmalıdır.");
        }
    }
}
