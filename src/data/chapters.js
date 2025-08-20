// data/chapters.js - Detailed chapter content for TBM

/**
 * Detailed chapter content organized by book ID
 * This contains the full content for each chapter including text, examples, and interactive elements
 */
export const chaptersData = {
  // Mathematics for Class 10 - Book ID: 1
  1: {
    101: {
      id: 101,
      title: "Algebra Foundations",
      content: `# Chapter 1: Algebra Foundations

## Introduction to Algebra

Algebra is a branch of mathematics that uses symbols and letters to represent numbers and quantities in formulas and equations. The word "algebra" comes from the Arabic word "al-jabr," meaning "reunion of broken parts."

## 1.1 Variables and Constants

### Variables
A **variable** is a symbol (usually a letter) that represents an unknown number or a number that can change. Common variables include:
- x, y, z (most common)
- a, b, c (often used for constants)
- n, m (frequently used for integers)

**Example:** In the expression 3x + 5, 'x' is a variable.

### Constants
A **constant** is a fixed value that doesn't change. It can be:
- A number: 5, -3, 0.75
- A symbol representing a fixed value: π (pi), e (Euler's number)

**Example:** In the expression 3x + 5, both '3' and '5' are constants.

### Algebraic Expressions
An algebraic expression is a combination of variables, constants, and mathematical operations.

**Examples:**
- 2x + 3
- 5y² - 4y + 7
- (a + b)/2

## 1.2 Linear Equations

A linear equation is an equation where the highest power of the variable is 1. The general form is:

**ax + b = 0**

Where:
- a and b are constants
- x is the variable
- a ≠ 0

### Solving Linear Equations

**Method 1: Isolation Method**
1. Move all terms with variables to one side
2. Move all constants to the other side
3. Divide both sides by the coefficient of the variable

**Example 1:** Solve 3x + 5 = 20
- Step 1: 3x = 20 - 5
- Step 2: 3x = 15
- Step 3: x = 15/3 = 5

**Example 2:** Solve 2(x - 3) = 10
- Step 1: 2x - 6 = 10
- Step 2: 2x = 10 + 6
- Step 3: 2x = 16
- Step 4: x = 8

## 1.3 Systems of Linear Equations

A system of linear equations consists of two or more linear equations with the same variables.

### Methods of Solving Systems

**1. Substitution Method**
- Solve one equation for one variable
- Substitute into the other equation
- Solve for the remaining variable

**2. Elimination Method**
- Multiply equations to make coefficients equal
- Add or subtract equations to eliminate one variable
- Solve for the remaining variable

**Example System:**
x + y = 7
2x - y = 5

Using elimination:
- Add the equations: 3x = 12
- Therefore: x = 4
- Substitute back: 4 + y = 7, so y = 3
- Solution: (4, 3)

## Practice Problems

1. Solve for x: 4x - 9 = 23
2. Find the value of y: 3(y + 2) = 21
3. Solve the system:
   - 2x + 3y = 13
   - x - y = 1

## Summary

In this chapter, we learned:
- The difference between variables and constants
- How to write and interpret algebraic expressions
- Methods for solving linear equations
- Techniques for solving systems of linear equations

These foundational concepts will be essential for all future algebra topics.`,
      examples: [
        {
          title: "Solving Simple Linear Equations",
          problem: "Solve: 5x - 7 = 18",
          solution: "5x = 18 + 7 = 25, therefore x = 5"
        },
        {
          title: "System of Equations",
          problem: "Solve: x + 2y = 8 and 3x - y = 5",
          solution: "Using substitution: x = 8 - 2y, substitute into second equation: 3(8 - 2y) - y = 5, solve to get y = 1, x = 6"
        }
      ]
    },
    102: {
      id: 102,
      title: "Geometry Basics",
      content: `# Chapter 2: Geometry Basics

## Introduction to Geometry

Geometry is the branch of mathematics concerned with the properties and relations of points, lines, surfaces, and solids. The word comes from Greek words "geo" (earth) and "metron" (measure).

## 2.1 Fundamental Concepts

### Points
A **point** represents a location and has no dimension (no length, width, or height). Points are usually named with capital letters.

**Notation:** Point A, Point B, Point P

### Lines
A **line** extends infinitely in both directions and has no thickness. It's determined by any two points on it.

**Types of Lines:**
- **Line segment:** Part of a line with two endpoints
- **Ray:** Part of a line with one endpoint, extending infinitely in one direction

**Notation:** Line AB (written as AB with a line over it)

### Planes
A **plane** is a flat surface that extends infinitely in all directions. It has no thickness.

## 2.2 Angles

An **angle** is formed when two rays share a common endpoint called the vertex.

### Types of Angles
- **Acute angle:** Less than 90°
- **Right angle:** Exactly 90°
- **Obtuse angle:** Between 90° and 180°
- **Straight angle:** Exactly 180°
- **Reflex angle:** Between 180° and 360°

### Angle Relationships
- **Complementary angles:** Two angles that sum to 90°
- **Supplementary angles:** Two angles that sum to 180°
- **Vertical angles:** Opposite angles formed by intersecting lines (always equal)

## 2.3 Triangles

A triangle is a polygon with three sides and three angles.

### Classification by Sides
- **Equilateral:** All three sides equal
- **Isosceles:** Two sides equal
- **Scalene:** All sides different

### Classification by Angles
- **Acute triangle:** All angles less than 90°
- **Right triangle:** One angle equals 90°
- **Obtuse triangle:** One angle greater than 90°

### Triangle Properties
1. **Angle Sum Property:** The sum of all angles in a triangle is 180°
2. **Exterior Angle Property:** An exterior angle equals the sum of the two non-adjacent interior angles

### The Pythagorean Theorem
In a right triangle with legs a and b, and hypotenuse c:

**a² + b² = c²**

**Example:** If a = 3 and b = 4, then:
c² = 3² + 4² = 9 + 16 = 25
Therefore, c = 5

## 2.4 Circles

A **circle** is the set of all points in a plane that are equidistant from a fixed center point.

### Circle Elements
- **Center:** The fixed point
- **Radius:** Distance from center to any point on the circle
- **Diameter:** Line segment passing through center with endpoints on circle
- **Chord:** Line segment with both endpoints on the circle
- **Arc:** Part of the circle between two points
- **Sector:** Region bounded by two radii and an arc

### Circle Formulas
- **Circumference:** C = 2πr or C = πd
- **Area:** A = πr²

**Example:** Circle with radius 5 cm
- Circumference = 2π(5) = 10π cm ≈ 31.4 cm
- Area = π(5)² = 25π cm² ≈ 78.5 cm²

## 2.5 Coordinate Geometry

### The Coordinate Plane
- **x-axis:** Horizontal axis
- **y-axis:** Vertical axis
- **Origin:** Point (0, 0) where axes intersect
- **Quadrants:** Four regions formed by the axes

### Distance Formula
Distance between points (x₁, y₁) and (x₂, y₂):

**d = √[(x₂ - x₁)² + (y₂ - y₁)²]**

### Midpoint Formula
Midpoint of segment connecting (x₁, y₁) and (x₂, y₂):

**M = ((x₁ + x₂)/2, (y₁ + y₂)/2)**

## Practice Problems

1. Find the third angle of a triangle if two angles are 45° and 67°
2. Calculate the hypotenuse of a right triangle with legs 8 and 15
3. Find the area of a circle with diameter 12 cm
4. Calculate the distance between points (2, 3) and (5, 7)

## Summary

This chapter covered:
- Basic geometric elements: points, lines, and planes
- Angle types and relationships
- Triangle classification and properties
- Circle elements and formulas
- Introduction to coordinate geometry

These concepts form the foundation for more advanced geometric studies.`,
      examples: [
        {
          title: "Pythagorean Theorem Application",
          problem: "Find the length of the hypotenuse if the legs are 5 and 12",
          solution: "c² = 5² + 12² = 25 + 144 = 169, therefore c = 13"
        },
        {
          title: "Circle Area Calculation",
          problem: "Find the area of a circle with radius 6 cm",
          solution: "A = πr² = π(6)² = 36π ≈ 113.1 cm²"
        }
      ]
    },
    103: {
      id: 103,
      title: "Trigonometry",
      content: `# Chapter 3: Trigonometry

## Introduction to Trigonometry

Trigonometry is the study of relationships between angles and sides in triangles. The word comes from Greek: "trigonon" (triangle) and "metron" (measure).

## 3.1 Trigonometric Ratios

In a right triangle, there are six trigonometric ratios:

### Primary Ratios
For angle θ in a right triangle:
- **Sine (sin):** sin θ = opposite/hypotenuse
- **Cosine (cos):** cos θ = adjacent/hypotenuse  
- **Tangent (tan):** tan θ = opposite/adjacent

### Reciprocal Ratios
- **Cosecant (csc):** csc θ = 1/sin θ = hypotenuse/opposite
- **Secant (sec):** sec θ = 1/cos θ = hypotenuse/adjacent
- **Cotangent (cot):** cot θ = 1/tan θ = adjacent/opposite

### Memory Aid: SOH-CAH-TOA
- **S**ine = **O**pposite over **H**ypotenuse
- **C**osine = **A**djacent over **H**ypotenuse
- **T**angent = **O**pposite over **A**djacent

## 3.2 Special Angles

### Common Angle Values

| Angle | sin θ | cos θ | tan θ |
|-------|--------|--------|--------|
| 0°    | 0      | 1      | 0      |
| 30°   | 1/2    | √3/2   | 1/√3   |
| 45°   | 1/√2   | 1/√2   | 1      |
| 60°   | √3/2   | 1/2    | √3     |
| 90°   | 1      | 0      | undefined |

### Deriving Special Angle Values

**For 30° and 60°:** Use an equilateral triangle
**For 45°:** Use an isosceles right triangle

## 3.3 Trigonometric Identities

### Fundamental Identities

**Pythagorean Identities:**
- sin²θ + cos²θ = 1
- 1 + tan²θ = sec²θ
- 1 + cot²θ = csc²θ

**Reciprocal Identities:**
- sin θ = 1/csc θ
- cos θ = 1/sec θ
- tan θ = 1/cot θ

**Quotient Identities:**
- tan θ = sin θ/cos θ
- cot θ = cos θ/sin θ

### Proving Identities

**Example:** Prove that tan²θ + 1 = sec²θ

Starting with sin²θ + cos²θ = 1:
- Divide by cos²θ: sin²θ/cos²θ + cos²θ/cos²θ = 1/cos²θ
- Simplify: tan²θ + 1 = sec²θ ✓

## 3.4 Applications of Trigonometry

### Heights and Distances

Trigonometry is used to find heights and distances that cannot be measured directly.

**Angle of Elevation:** Angle above horizontal
**Angle of Depression:** Angle below horizontal

### Problem-Solving Steps
1. Draw a diagram
2. Identify the known and unknown values
3. Choose the appropriate trigonometric ratio
4. Set up the equation
5. Solve for the unknown

**Example Problem:** 
A ladder leans against a wall at an angle of 60° with the ground. If the ladder is 10 meters long, how high up the wall does it reach?

**Solution:**
- sin 60° = height/10
- height = 10 × sin 60° = 10 × (√3/2) = 5√3 ≈ 8.66 meters

## 3.5 Trigonometric Equations

### Simple Trigonometric Equations

**Example 1:** Solve sin θ = 1/2 for 0° ≤ θ ≤ 360°
- θ = 30° and θ = 150°

**Example 2:** Solve cos θ = 0 for 0° ≤ θ ≤ 360°
- θ = 90° and θ = 270°

### General Solutions
For equation sin θ = k:
- If -1 ≤ k ≤ 1, then θ = nπ + (-1)ⁿ sin⁻¹(k)

## 3.6 Graphs of Trigonometric Functions

### Key Features
- **Domain:** All real numbers (for sin and cos)
- **Range:** [-1, 1] (for sin and cos)
- **Period:** 2π or 360°
- **Amplitude:** 1 (for basic functions)

### Transformations
- y = A sin(Bx + C) + D
  - A: Amplitude
  - B: affects period (period = 2π/B)
  - C: horizontal shift
  - D: vertical shift

## Practice Problems

1. If sin θ = 3/5, find cos θ and tan θ
2. Prove that sin²θ/(1 + cos θ) = 1 - cos θ
3. A tower casts a shadow 50m long when the angle of elevation of the sun is 30°. Find the height of the tower.
4. Solve: 2 sin θ - 1 = 0 for 0° ≤ θ ≤ 360°

## Summary

In this chapter, we explored:
- The six trigonometric ratios and their relationships
- Values of trigonometric functions for special angles
- Fundamental trigonometric identities
- Applications in solving height and distance problems
- Basic trigonometric equations and their solutions

Trigonometry provides powerful tools for solving real-world problems involving angles and distances.`,
      examples: [
        {
          title: "Finding Missing Side",
          problem: "In a right triangle, if angle A = 30° and hypotenuse = 20, find the opposite side",
          solution: "sin 30° = opposite/20, so opposite = 20 × sin 30° = 20 × 0.5 = 10"
        },
        {
          title: "Height and Distance Problem",
          problem: "From a point 100m away from a tower, the angle of elevation to the top is 45°. Find the height",
          solution: "tan 45° = height/100, so height = 100 × tan 45° = 100 × 1 = 100m"
        }
      ]
    },
    104: {
      id: 104,
      title: "Statistics",
      content: `# Chapter 4: Statistics

## Introduction to Statistics

Statistics is the science of collecting, organizing, analyzing, and interpreting data to make informed decisions. It helps us understand patterns and draw conclusions from information.

## 4.1 Data Collection and Organization

### Types of Data

**Quantitative Data:** Numerical data that can be measured
- **Discrete:** Countable values (number of students, cars, etc.)
- **Continuous:** Measurable values (height, weight, temperature)

**Qualitative Data:** Non-numerical data that describes qualities
- **Nominal:** Categories without order (colors, names)
- **Ordinal:** Categories with order (grades: A, B, C, D)

### Data Representation

**Frequency Distribution Table:**
Shows how often each value appears in a dataset.

**Example:** Test scores of 20 students
| Score | Frequency |
|-------|-----------|
| 70-79 | 3         |
| 80-89 | 7         |
| 90-99 | 10        |

**Cumulative Frequency:**
Running total of frequencies up to each class.

## 4.2 Measures of Central Tendency

### Mean (Average)
**Formula:** Mean = Sum of all values / Number of values

**For ungrouped data:** x̄ = (x₁ + x₂ + ... + xₙ)/n

**For grouped data:** x̄ = Σ(f × x)/Σf
Where f = frequency, x = class midpoint

**Example:** Find mean of 5, 7, 3, 9, 6
Mean = (5 + 7 + 3 + 9 + 6)/5 = 30/5 = 6

### Median
The middle value when data is arranged in order.

**For odd number of values:** Middle value
**For even number of values:** Average of two middle values

**Example:** Find median of 3, 5, 6, 7, 9
Median = 6 (middle value)

**Example:** Find median of 3, 5, 6, 7, 9, 11
Median = (6 + 7)/2 = 6.5

### Mode
The value that appears most frequently in the dataset.

**Example:** In the set {2, 3, 3, 5, 7, 3, 9}, mode = 3

## 4.3 Measures of Dispersion

### Range
**Range = Highest value - Lowest value**

### Standard Deviation
Measures how spread out the data is from the mean.

**Formula:** σ = √[Σ(x - x̄)²/n]

### Variance
**Variance = (Standard Deviation)²**

## 4.4 Graphical Representation

### Histogram
Bar graph showing frequency distribution of continuous data.

**Steps to create:**
1. Determine class intervals
2. Count frequencies
3. Draw bars with no gaps

### Bar Graph
Used for categorical (discrete) data with gaps between bars.

### Pie Chart
Circle divided into sectors representing different categories.
**Angle for each sector = (Frequency/Total) × 360°**

### Line Graph
Shows trends over time with points connected by lines.

## 4.5 Probability Basics

### Definition
Probability is the likelihood of an event occurring.

**Formula:** P(Event) = Number of favorable outcomes / Total number of possible outcomes

**Range:** 0 ≤ P(Event) ≤ 1
- P = 0: Impossible event
- P = 1: Certain event
- P = 0.5: Equally likely

### Types of Events
- **Mutually Exclusive:** Cannot occur together
- **Independent:** One event doesn't affect the other
- **Dependent:** One event affects the probability of another

### Basic Probability Rules

**Addition Rule (for mutually exclusive events):**
P(A or B) = P(A) + P(B)

**Multiplication Rule (for independent events):**
P(A and B) = P(A) × P(B)

**Complement Rule:**
P(not A) = 1 - P(A)

## 4.6 Real-World Applications

### Quality Control
Manufacturing companies use statistics to monitor product quality.

### Market Research
Businesses collect and analyze consumer data to make decisions.

### Medical Research
Clinical trials use statistical methods to test treatments.

### Sports Analytics
Teams analyze player and game statistics to improve performance.

## Practice Problems

1. Find the mean, median, and mode of: 12, 15, 11, 18, 15, 20, 16
2. A coin is tossed 3 times. What's the probability of getting exactly 2 heads?
3. Create a frequency table for the data: 23, 25, 24, 26, 25, 27, 23, 24, 25
4. In a class of 30 students, 18 like pizza and 20 like burgers. If 12 like both, how many like neither?

## Summary

This chapter covered:
- Methods of data collection and organization
- Measures of central tendency (mean, median, mode)
- Basic measures of dispersion
- Graphical representation techniques
- Fundamental probability concepts
- Real-world applications of statistics

Statistics provides essential tools for understanding and interpreting data in our data-driven world.`,
      examples: [
        {
          title: "Calculating Mean for Grouped Data",
          problem: "Find mean for: Class 10-20 (f=5), 20-30 (f=8), 30-40 (f=3)",
          solution: "Midpoints: 15, 25, 35. Mean = (5×15 + 8×25 + 3×35)/(5+8+3) = 380/16 = 23.75"
        },
        {
          title: "Probability Calculation",
          problem: "What's the probability of rolling an even number on a standard die?",
          solution: "Even numbers: 2, 4, 6. P(even) = 3/6 = 1/2 = 0.5"
        }
      ]
    }
  },

  // Physics Essentials - Book ID: 2
  2: {
    201: {
      id: 201,
      title: "Laws of Motion",
      content: `# Chapter 1: Laws of Motion

## Introduction

Sir Isaac Newton's three laws of motion form the foundation of classical mechanics and describe the relationship between forces acting on a body and its motion.

## 1.1 Newton's First Law of Motion

### Statement
"Every object remains at rest or in uniform motion in a straight line unless compelled to change by forces acting upon it."

This law is also known as the **Law of Inertia**.

### Key Concepts

**Inertia:** The tendency of an object to resist changes in its state of motion.

**Types of Inertia:**
- **Inertia of Rest:** Tendency to remain at rest
- **Inertia of Motion:** Tendency to keep moving
- **Inertia of Direction:** Tendency to move in a straight line

### Examples
1. **Passengers lean forward** when a bus stops suddenly
2. **Objects slide backward** when a car accelerates
3. **A book on a table** remains at rest until pushed

## 1.2 Newton's Second Law of Motion

### Statement
"The rate of change of momentum is directly proportional to the applied force and takes place in the direction of the force."

### Mathematical Form
**F = ma**

Where:
- F = Force (in Newtons)
- m = Mass (in kilograms)
- a = Acceleration (in m/s²)

### Alternative Form
**F = dp/dt**

Where p = momentum = mv

### Key Points
- Force and acceleration are in the same direction
- Larger force produces larger acceleration
- More massive objects need more force for same acceleration

### Problem-Solving Steps
1. Identify all forces acting on the object
2. Determine the net force
3. Apply F = ma
4. Solve for unknown quantity

**Example Problem:**
A 5 kg box is pushed with a force of 20 N. Find its acceleration.

**Solution:**
F = ma
20 = 5 × a
a = 4 m/s²

## 1.3 Newton's Third Law of Motion

### Statement
"For every action, there is an equal and opposite reaction."

### Important Notes
- Action and reaction forces:
  - Are equal in magnitude
  - Are opposite in direction
  - Act on different objects
  - Occur simultaneously

### Examples of Action-Reaction Pairs
1. **Walking:** Foot pushes ground backward → Ground pushes foot forward
2. **Swimming:** Hands push water backward → Water pushes swimmer forward
3. **Rocket propulsion:** Gases pushed down → Rocket pushed up
4. **Recoil of gun:** Bullet pushed forward → Gun pushed backward

## 1.4 Applications and Problem Solving

### Free Body Diagrams
Steps to draw:
1. Isolate the object
2. Identify all forces
3. Draw force vectors
4. Choose coordinate system
5. Apply Newton's laws

### Types of Forces
- **Weight (W):** W = mg (always downward)
- **Normal force (N):** Perpendicular to surface
- **Tension (T):** Force in rope/string
- **Friction (f):** Opposes motion
- **Applied force:** External push/pull

### Equilibrium
When net force = 0:
- **Static equilibrium:** Object at rest
- **Dynamic equilibrium:** Object moving at constant velocity

### Problem Types

**Type 1: Single Object**
Apply F_net = ma directly

**Type 2: Connected Objects**
- Find acceleration of system
- Analyze forces on each object
- Use Newton's second law for each

**Type 3: Inclined Planes**
- Resolve weight into components
- Apply Newton's laws along and perpendicular to incline

## Practice Problems

1. A 10 kg object experiences a net force of 50 N. Find its acceleration.

2. A car of mass 1000 kg accelerates from rest to 20 m/s in 10 seconds. Find the driving force (ignore friction).

3. Two blocks of masses 5 kg and 3 kg are connected by a rope. If a force of 16 N pulls the 5 kg block, find:
   a) Acceleration of the system
   b) Tension in the rope

## Summary

Newton's Laws provide the foundation for understanding motion:

1. **First Law:** Objects resist changes in motion (inertia)
2. **Second Law:** F = ma relates force, mass, and acceleration
3. **Third Law:** Forces always come in action-reaction pairs

These laws help us analyze and predict the motion of objects under various force conditions.`,
      examples: [
        {
          title: "Force and Acceleration",
          problem: "A 2 kg ball is kicked with a force of 8 N. Find its acceleration.",
          solution: "Using F = ma: 8 = 2 × a, therefore a = 4 m/s²"
        },
        {
          title: "Action-Reaction Example",
          problem: "Explain why a person can walk on the ground using Newton's third law.",
          solution: "When walking, the foot pushes backward on the ground (action). The ground pushes forward on the foot with equal force (reaction), propelling the person forward."
        }
      ]
    }
  },

  // Add more chapters for other books...
  3: {
    301: {
      id: 301,
      title: "Atoms and Molecules",
      content: `# Chapter 1: Atoms and Molecules

## Introduction to Matter

Everything around us is made up of matter. Matter is anything that has mass and occupies space. All matter is composed of tiny particles called atoms.

## 1.1 Atomic Structure

### Discovery of the Atom
- **Democritus (460 BC):** First proposed the idea of atoms
- **John Dalton (1803):** Atomic theory
- **J.J. Thomson (1897):** Discovered electrons
- **Ernest Rutherford (1911):** Nuclear model
- **Niels Bohr (1913):** Planetary model

### Components of an Atom

**Nucleus:**
- Contains protons (positive charge) and neutrons (no charge)
- Very small but contains most of the atom's mass
- Diameter: ~10⁻¹⁵ m

**Electrons:**
- Negatively charged particles
- Orbit around the nucleus in energy levels
- Mass: 1/1836 of proton mass

### Atomic Number and Mass Number
- **Atomic Number (Z):** Number of protons = Number of electrons (in neutral atom)
- **Mass Number (A):** Number of protons + Number of neutrons
- **Neutrons:** A - Z

## 1.2 Molecules and Compounds

### Definition
A **molecule** is the smallest particle of an element or compound that can exist independently and retain all its chemical properties.

### Types of Molecules
1. **Homoatomic:** Same type of atoms (O₂, N₂)
2. **Heteroatomic:** Different types of atoms (H₂O, CO₂)

### Chemical Formulas
- **Molecular formula:** Shows actual number of atoms (H₂O)
- **Empirical formula:** Shows simplest ratio (CH₂O for glucose C₆H₁₂O₆)

## Practice Problems
1. Find the number of neutrons in Carbon-14
2. Calculate the molecular mass of water (H₂O)
3. Determine the empirical formula for a compound with 40% carbon, 6.7% hydrogen, and 53.3% oxygen`,
      examples: [
        {
          title: "Atomic Structure",
          problem: "An atom has 17 protons and 18 neutrons. Find its atomic number and mass number.",
          solution: "Atomic number = 17 (number of protons), Mass number = 17 + 18 = 35"
        }
      ]
    }
  }
};

/**
 * Helper function to get chapter content by book and chapter ID
 */
export function getChapterContent(bookId, chapterId) {
  return chaptersData[bookId]?.[chapterId] || null;
}

/**
 * Helper function to get all chapters for a book
 */
export function getBookChapters(bookId) {
  return chaptersData[bookId] || {};
}

/**
 * Sample page content for flip book reader
 */
export const sampleBookPages = [
  "Welcome to Mathematics for Class 10! This comprehensive textbook covers essential topics including Algebra, Geometry, Trigonometry, and Statistics with solved examples and practice exercises.",
  
  `# Chapter 1: Algebra Foundations

Variables, constants, and expressions form the building blocks of algebra. In this chapter, we'll explore how to manipulate algebraic expressions and solve equations.

## What is Algebra?
Algebra uses letters and symbols to represent numbers and quantities in mathematical expressions and equations.`,

  `## Linear Equations

A linear equation has the form: **ax + b = 0**

### Example Problems:
1. Solve: 3x + 5 = 20
   - Step 1: 3x = 15
   - Step 2: x = 5

2. Solve: 2(x - 3) = 10
   - Step 1: 2x - 6 = 10
   - Step 2: x = 8`,

  `# Chapter 2: Geometry Basics

Geometry studies shapes, sizes, and spatial relationships. We'll cover points, lines, angles, and basic geometric figures.

## Fundamental Elements:
- **Point:** Represents a location
- **Line:** Extends infinitely in both directions
- **Plane:** Flat surface extending infinitely`,

  `## The Pythagorean Theorem

For a right triangle with legs a and b, and hypotenuse c:

**a² + b² = c²**

### Example:
If a = 3 and b = 4:
c² = 9 + 16 = 25
Therefore, c = 5`,

  `# Chapter 3: Trigonometry

Trigonometry deals with relationships between angles and sides in triangles.

## Basic Ratios:
- **sin θ = opposite/hypotenuse**
- **cos θ = adjacent/hypotenuse**
- **tan θ = opposite/adjacent**

Remember: **SOH-CAH-TOA**`,

  `## Special Angles

| Angle | sin θ | cos θ | tan θ |
|-------|--------|--------|--------|
| 30°   | 1/2    | √3/2   | 1/√3   |
| 45°   | 1/√2   | 1/√2   | 1      |
| 60°   | √3/2   | 1/2    | √3     |

These values are fundamental in trigonometry.`,

  `# Chapter 4: Statistics

Statistics helps us collect, organize, and interpret data.

## Measures of Central Tendency:
- **Mean:** Average of all values
- **Median:** Middle value when arranged in order
- **Mode:** Most frequently occurring value`,

  `## Probability Basics

**Probability = Favorable outcomes / Total outcomes**

### Example:
Rolling a die:
- P(even number) = 3/6 = 1/2
- P(number > 4) = 2/6 = 1/3

Probability ranges from 0 to 1.`,

  "Chapter Summary: We've covered the fundamentals of mathematics including algebra, geometry, trigonometry, and statistics. These concepts form the foundation for advanced mathematical studies."
];

/**
 * Additional static data for sample content
 */
export const sampleQuestions = {
  algebra: [
    "Solve for x: 4x - 7 = 21",
    "Find the value of y if 3y + 8 = 26",
    "Simplify: 2(3x + 4) - 5x",
    "Solve the system: x + y = 10, 2x - y = 5"
  ],
  geometry: [
    "Find the area of a triangle with base 8 cm and height 6 cm",
    "Calculate the circumference of a circle with radius 5 cm",
    "What is the sum of interior angles in a pentagon?",
    "Find the missing angle in a triangle with angles 45° and 67°"
  ],
  trigonometry: [
    "If sin θ = 3/5, find cos θ and tan θ",
    "Calculate the height of a tower if the angle of elevation is 30° from 100m away",
    "Prove that sin²θ + cos²θ = 1",
    "Find all values of θ where sin θ = 1/2 for 0° ≤ θ ≤ 360°"
  ],
  statistics: [
    "Find the mean of: 12, 15, 18, 20, 25",
    "What is the median of: 3, 7, 9, 12, 15, 18, 21?",
    "Calculate the probability of getting heads twice when flipping a coin three times",
    "Create a frequency table for the data: 2, 3, 2, 4, 3, 2, 5, 3, 4"
  ]
};

/**
 * Chapter summaries for quick reference
 */
export const chapterSummaries = {
  1: {
    101: "Introduction to algebraic concepts including variables, constants, linear equations, and systems of equations. Essential foundation for all future algebra topics.",
    102: "Basic geometric elements, angle relationships, triangle properties, circles, and coordinate geometry. Includes the Pythagorean theorem and distance formulas.",
    103: "Trigonometric ratios, special angles, identities, and real-world applications. Covers height and distance problems using trigonometry.",
    104: "Statistical concepts including data collection, measures of central tendency, graphical representation, and basic probability theory."
  },
  2: {
    201: "Newton's three laws of motion and their applications. Includes force analysis, equilibrium, and problem-solving techniques for motion problems.",
    202: "Work, energy, and power concepts. Covers kinetic and potential energy, conservation laws, and energy transformations in physical systems.",
    203: "Electric current, circuits, and Ohm's law. Introduction to electrical phenomena and circuit analysis techniques."
  },
  3: {
    301: "Atomic structure, molecules, and chemical bonding. Foundation concepts for understanding matter at the molecular level.",
    302: "Types of chemical reactions, equation balancing, and reaction rates. Essential chemistry concepts for understanding chemical processes.",
    303: "Properties of acids and bases, pH scale, and acid-base reactions. Introduction to solution chemistry."
  }
};

/**
 * Interactive elements for enhanced learning
 */
export const interactiveElements = {
  quizzes: {
    algebra: [
      {
        question: "What is the value of x in 3x + 7 = 22?",
        options: ["5", "7", "15", "29"],
        correct: 0,
        explanation: "3x = 22 - 7 = 15, so x = 5"
      },
      {
        question: "Which of the following is a linear equation?",
        options: ["x² + 2x = 5", "3x + 4 = 7", "x³ - 1 = 0", "√x = 4"],
        correct: 1,
        explanation: "A linear equation has the highest power of variable as 1"
      }
    ],
    geometry: [
      {
        question: "What is the sum of angles in a triangle?",
        options: ["90°", "180°", "270°", "360°"],
        correct: 1,
        explanation: "The sum of all angles in any triangle is always 180°"
      },
      {
        question: "In a right triangle with legs 3 and 4, what is the hypotenuse?",
        options: ["5", "6", "7", "12"],
        correct: 0,
        explanation: "Using Pythagorean theorem: c² = 3² + 4² = 9 + 16 = 25, so c = 5"
      }
    ]
  },
  
  flashcards: {
    formulas: [
      {
        front: "Quadratic Formula",
        back: "x = (-b ± √(b² - 4ac)) / 2a"
      },
      {
        front: "Area of Circle",
        back: "A = πr²"
      },
      {
        front: "Pythagorean Theorem",
        back: "a² + b² = c²"
      },
      {
        front: "Distance Formula",
        back: "d = √[(x₂-x₁)² + (y₂-y₁)²]"
      }
    ],
    
    definitions: [
      {
        front: "Variable",
        back: "A symbol (usually a letter) that represents an unknown number"
      },
      {
        front: "Coefficient",
        back: "The numerical factor of a term containing a variable"
      },
      {
        front: "Hypotenuse",
        back: "The longest side of a right triangle, opposite the right angle"
      }
    ]
  }
};

/**
 * Reference materials and additional resources
 */
export const referenceData = {
  formulaSheets: {
    algebra: [
      "Linear equation: ax + b = 0",
      "Quadratic equation: ax² + bx + c = 0",
      "Slope formula: m = (y₂ - y₁)/(x₂ - x₁)",
      "Distance formula: d = √[(x₂-x₁)² + (y₂-y₁)²]"
    ],
    geometry: [
      "Triangle area: A = ½ × base × height",
      "Circle area: A = πr²",
      "Circle circumference: C = 2πr",
      "Pythagorean theorem: a² + b² = c²"
    ],
    trigonometry: [
      "sin θ = opposite/hypotenuse",
      "cos θ = adjacent/hypotenuse", 
      "tan θ = opposite/adjacent",
      "sin²θ + cos²θ = 1"
    ]
  },
  
  glossary: {
    A: [
      { term: "Algebra", definition: "Branch of mathematics using letters and symbols to represent numbers" },
      { term: "Angle", definition: "Figure formed by two rays sharing a common endpoint" },
      { term: "Area", definition: "Amount of space inside a 2D shape" }
    ],
    B: [
      { term: "Base", definition: "Bottom side of a geometric figure" },
      { term: "Binomial", definition: "Algebraic expression with exactly two terms" }
    ],
    C: [
      { term: "Coefficient", definition: "Numerical factor in a term with variables" },
      { term: "Circle", definition: "Set of all points equidistant from a center point" },
      { term: "Constant", definition: "A value that does not change" }
    ]
  }
};// data/chapters.js - Detailed chapter content for TBM

/**
 * Detailed chapter content organized by book ID
 * This contains the full content for each chapter including text, examples, and interactive elements
 */
