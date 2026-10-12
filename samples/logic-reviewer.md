# Introduction to Digital Logic — Sample Question Bank

## Topic: Number Systems

### Question
What is the decimal value of the binary number 1011?
A. 9
B. 10
C. 11
D. 13
**Answer:** C
**Explanation:** The place values are 8, 4, 2, and 1. Therefore, 1011₂ equals 8 + 0 + 2 + 1 = 11.
**Additional details:** In positional notation, each binary digit is weighted by a power of 2.

---

### Question
Which binary number represents decimal 13?
A. 1011
B. 1101
C. 1110
D. 1001
**Answer:** B
**Explanation:** Decimal 13 is 8 + 4 + 1, so its binary representation is 1101.

---

## Topic: Boolean Algebra

### Question
Which expression is equivalent to A AND (A OR B)?
A. A
B. B
C. A OR B
D. A AND B
**Answer:** A
**Explanation:** The absorption law simplifies A AND (A OR B) to A.
**Additional details:** The dual absorption identity is A OR (A AND B) = A.

---

### Question
According to De Morgan's law, what is the complement of A AND B?
A. A AND B
B. A OR B
C. (NOT A) OR (NOT B)
D. (NOT A) AND (NOT B)
**Answer:** C
**Explanation:** De Morgan's law states that NOT (A AND B) equals (NOT A) OR (NOT B).

---

### Question
For which input values is A XOR B equal to 1?
A. A = 0, B = 0 only
B. A = 1, B = 1 only
C. A and B have different values
D. A and B have the same value
**Answer:** C
**Explanation:** XOR produces 1 when its inputs differ and 0 when they are equal.

---

## Topic: Logic Gates and Truth Tables

### Question
What is the output of a NAND gate when both inputs are 1?
A. 0
B. 1
C. It alternates between 0 and 1
D. The output is undefined
**Answer:** A
**Explanation:** AND produces 1 when both inputs are 1, and NAND complements that result.

---

### Question
Which gate produces an output of 1 only when all of its inputs are 1?
A. OR
B. AND
C. XOR
D. NOR
**Answer:** B
**Explanation:** An AND gate outputs 1 only when every input is 1.

---

## Topic: Combinational Circuits

### Question
What is the main purpose of a multiplexer?
A. To store one bit of data
B. To select one of several inputs and route it to an output
C. To count clock pulses
D. To convert an analog signal into a digital signal
**Answer:** B
**Explanation:** A multiplexer uses select inputs to choose which data input reaches its output.
**Additional details:** A 4-to-1 multiplexer needs two select bits to choose among its four data inputs.

---

### Question
How many select bits are needed for an 8-to-1 multiplexer?
A. 2
B. 3
C. 4
D. 8
**Answer:** B
**Explanation:** The number of select bits is log₂ of the number of inputs; log₂(8) = 3.

---

## Topic: Sequential Circuits

### Question
What distinguishes a sequential logic circuit from a combinational logic circuit?
A. A sequential circuit can store state
B. A sequential circuit never uses logic gates
C. A sequential circuit has no outputs
D. A sequential circuit always has exactly one input
**Answer:** A
**Explanation:** Sequential circuits use stored state, so their outputs can depend on both current inputs and previous state.

---

### Question
What is the purpose of a clock signal in a synchronous sequential circuit?
A. To determine the number of logic gates
B. To coordinate when state changes occur
C. To permanently hold every output at 0
D. To replace all data inputs
**Answer:** B
**Explanation:** A clock provides timing events that coordinate state updates in synchronous circuits.
**Additional details:** In an edge-triggered flip-flop, state updates in response to a specified clock edge.
