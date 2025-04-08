package main

import (
	"context"
	"errors"
	"fmt"
	"log"
	"net/http"

	"demo-go+next/calculator"
	"demo-go+next/calculator/calculatorconnect"

	"github.com/bufbuild/connect-go"
)

type CalculatorService struct{}

func (s *CalculatorService) Calculate(
	ctx context.Context,
	req *connect.Request[calculator.CalculationRequest],
) (*connect.Response[calculator.CalculationResponse], error) {
	firstNumber := req.Msg.FirstNumber
	secondNumber := req.Msg.SecondNumber
	operation := req.Msg.Operation

	var result float64
	switch operation {
	case "+":
		result = Add(firstNumber, secondNumber)
	case "-":
		result = Subtract(firstNumber, secondNumber)
	case "*":
		result = Multiply(firstNumber, secondNumber)
	case "/":
		result = Divide(firstNumber, secondNumber)
	default:
		return nil, connect.NewError(connect.CodeInvalidArgument, fmt.Errorf("unknown operation: %s", operation))
	}

	return connect.NewResponse(&calculator.CalculationResponse{
		Result: result,
	}), nil
}

func main() {
	calculatorService := &CalculatorService{}
	mux := http.NewServeMux()
	path, handler := calculatorconnect.NewCalculatorServiceHandler(calculatorService)
	mux.Handle(path, handler)
	log.Println("Listening on :8080")
	if err := http.ListenAndServe(":8080", mux); err != nil {
		log.Fatalf("could not start server: %v", err)
	}
}

// 完善加减乘除运算逻辑
func Add(a, b float64) float64 {
	return a + b
}

func Subtract(a, b float64) float64 {
	return a - b
}

func Multiply(a, b float64) float64 {
	return a * b
}

func Divide(a, b float64) (float64, error) {
	if b == 0 {
		return 0, errors.New("division by zero")
	}
	return a / b, nil
}
