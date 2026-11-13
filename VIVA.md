# Length Contraction Visualiser Viva

MAIT, Delhi · B.Tech CST, Section R · Semester 1 · Applied Physics I (BS-105)

## Five-person demo

| Speaker | What to cover |
|---|---|
| Vaibhav Jain | Open the app and state the aim: visualise the change in parallel length with relative speed. |
| Kriti Gautaum | Explain proper length, simultaneous endpoints and the Lorentz derivation. |
| Anmol Srivastava | Run 100 m at rest, 0.6c and 0.8c. Align both rods and explain the graph. |
| Harsh Maheshwari | Explain Python calculations, browser drawing, validation and CSV export. |
| Varun Mishra | Compare the outputs, distinguish simulation from measurement, and give the conclusion. |

Sabko formula, demo aur limitations aani chahiye. Yeh suggested speaking roles hain.

## Project questions

| Question | Short answer |
|---|---|
| What is proper length? | L₀ is the length measured in the rod’s rest frame. |
| How is the moving length measured? | Subtract the endpoint coordinates measured at the same time in the observer’s frame. |
| What is the formula? | β = v/c, γ = 1/√(1−β²), and L = L₀/γ. |
| How do you derive it? | Δx′ = γ(Δx−vΔt). The observer sets Δt = 0; then Δx′ = L₀ and Δx = L, so L₀ = γL. |
| Why measure both ends simultaneously? | Otherwise the rod moves between readings, so their difference is not its length at one time. |
| Does its width across the direction of motion also shrink? | No. Only the parallel component contracts. |
| Is the rod physically crushed? | No. Its rest length is unchanged; different observers use different simultaneous endpoint events. |
| What happens as v approaches c? | γ grows without bound and L tends to zero. A massive rod cannot reach c. |
| What do the colours show? | They encode the contraction percentage. They are a display choice, unrelated to Doppler shift. |
| Does the speed sweep show acceleration? | It compares separate constant-speed cases. The animation is slowed and does not model acceleration or material stress. |
| Is the drawing a photograph? | No. It shows simultaneous coordinate measurements; a camera receives light emitted at different times. |
| What does the backend do? | Python validates inputs and computes the readings. JavaScript updates the display. Python recomputes the CSV rows from the recorded inputs. |
| How did you check the calculations? | Compare known cases and the output with independent Python Decimal calculations. These are simulated readings, not experimental evidence. |

## Unit IV relativity

| Question | Short answer |
|---|---|
| What is an inertial frame? | A frame in which an isolated object moves in a straight line at constant velocity. Special relativity gives no universal preferred inertial frame. |
| What are the Galilean transforms? | x′ = x−vt, y′ = y, z′ = z, t′ = t. The classical velocity rule would give different vacuum light speeds in different frames. |
| What was the Michelson–Morley null result? | Rotating the interferometer did not show the predicted ether-wind fringe shift. It did not mean the interference fringes vanished. |
| What are Einstein’s postulates? | The laws of physics have the same form in inertial frames; the speed of light in vacuum is the same for all inertial observers. |
| State the Lorentz transforms. | For S′ moving at +v along x: x′ = γ(x−vt), t′ = γ(t−vx/c²), y′ = y and z′ = z. For the inverse use −v and swap frames. |
| What is relativity of simultaneity? | Two separated events simultaneous in one frame need not be simultaneous in another because t′ depends on x. |
| Define proper time and time dilation. | Δτ is read by one clock present at both events. In a frame where that clock moves, Δt = γΔτ. |
| How do you add parallel velocities? | u = (u′+v)/(1+u′v/c²). Substituting u′ = c gives u = c. |
| What are rest energy and total energy? | E₀ = mc², E = γmc², K = (γ−1)mc², where m is invariant mass. |
| What is the energy–momentum relation? | E² = p²c² + m²c⁴, with p = γmv. For a photon E = pc. |
| What is Lorentz invariance of Maxwell’s equations? | The equations keep their form when coordinates, E, B, charge and current are transformed consistently. The field components themselves can change. |

**Board derivations:** For a light clock with mirror spacing d, Δτ = 2d/c and (cΔt/2)² = d²+(vΔt/2)², giving Δt = γΔτ. For velocity addition divide the inverse Lorentz differentials dx = γ(dx′+vdt′) and dt = γ(dt′+v dx′/c²). For Michelson–Morley’s historical ether model with equal one-way arms a: t∥ = 2a/[c(1−β²)] and t⊥ = 2a/[c√(1−β²)]. A 90° rotation reverses the predicted time difference, giving an approximate shift of 2av²/(λc²) fringes.

## Unit IV lasers

| Question | Short answer |
|---|---|
| What does LASER stand for? | Light Amplification by Stimulated Emission of Radiation. |
| What is coherence? | A predictable phase relationship. Temporal coherence compares times; spatial coherence compares positions. |
| Absorption vs spontaneous vs stimulated emission? | Absorption raises an atom’s energy. Spontaneous emission occurs without a triggering field. Stimulated emission adds radiation to the stimulating optical mode. |
| What are A₂₁, B₁₂ and B₂₁? | A₂₁ governs spontaneous emission; B₁₂ absorption; B₂₁ stimulated emission. The induced rates per atom are Bρν, where ρν is spectral energy density per unit frequency. |
| What are Einstein’s relations? | g₁B₁₂ = g₂B₂₁ and A₂₁/B₂₁ = 8πhν³/c³ in vacuum for density per unit frequency. Derive by balancing transitions at equilibrium and comparing with Planck’s law. |
| What is population inversion? | More population per sublevel in the upper laser level: N₂/g₂ > N₁/g₁. Pumping establishes it; a metastable upper state helps store population. |
| Why use cavity mirrors? | They provide feedback. A partially transmitting mirror lets out part of the beam. At threshold, round-trip gain equals round-trip loss. |
| How does a He–Ne laser work? | Electrical discharge excites helium, which transfers energy to neon through collisions. Neon emits the familiar 632.8 nm line; the common red device is a four-level gas laser, usually continuous. |
| How does ruby work? | A flashlamp optically pumps Cr³⁺ ions in Al₂O₃. Relaxation populates a metastable state, then stimulated emission returns ions to the ground-state manifold. This three-level solid-state laser commonly emits pulses near 694.3 nm. |
| Why does ruby need stronger pumping for inversion? | Its lower laser level is the heavily populated ground state. A four-level system can empty its lower laser level more readily. |

## Quick numericals

| Case | Result |
|---|---|
| 100 m at 0.6c | 80 m; 20% shortening |
| 100 m at 0.8c | 60 m; 40% shortening |
| 100 m at 0.99c | 14.106736 m; 85.893264% shortening |
| 50 m at 0.8c | 30 m |
| Half-length speed | β = √(1−0.5²) ≈ 0.866025 |
| 2 μs proper time at 0.8c | 3.333333 μs in the observer frame |
| Two collinear speeds of 0.6c in the same direction | 0.882353c by relativistic addition |

**Last check:** 60 m is the remaining length; 40 m is the shortening. Always name the reference frame and units. Start with a one-sentence answer; give the derivation if asked.

## References

- [Official GGSIPU BS-105 syllabus, Unit IV (printed p. 15)](https://ipu.ac.in/Pubinfo2025/nt040825531%20%286%29.pdf)
- [OpenStax: Length Contraction](https://openstax.org/books/university-physics-volume-3/pages/5-4-length-contraction)
- [Feynman Lectures: Lorentz Transformations of the Fields](https://www.feynmanlectures.caltech.edu/II_26.html)
- [MIT OpenCourseWare: Laser Notes](https://ocw.mit.edu/courses/6-974-fundamentals-of-photonics-quantum-electronics-spring-2006/resources/laser/)
