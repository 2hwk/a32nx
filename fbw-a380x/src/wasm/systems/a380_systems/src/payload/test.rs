pub const HOURS_TO_MINUTES: u64 = 60;
pub const MINUTES_TO_SECONDS: u64 = 60;

use rand::seq::IteratorRandom;
use rand::SeedableRng;
use systems::electrical::Electricity;
use uom::si::mass::pound;

use super::*;
use crate::payload::A380Payload;
use crate::systems::simulation::{
    test::{ReadByName, SimulationTestBed, TestBed, WriteByName},
    Aircraft, SimulationElement, SimulationElementVisitor,
};

struct BoardingTestAircraft {
    payload: A380Payload,
}

impl BoardingTestAircraft {
    fn new(context: &mut InitContext) -> Self {
        Self {
            payload: A380Payload::new(context),
        }
    }

    fn pax_num(&self, ps: A380PaxStation) -> i8 {
        self.payload.pax_num(ps)
    }

    fn pax_payload(&self, ps: A380PaxStation) -> Mass {
        self.payload.pax_payload(ps)
    }

    fn max_pax(&self, ps: A380PaxStation) -> i8 {
        self.payload.max_pax(ps)
    }

    fn cargo(&self, cs: A380CargoStation) -> Mass {
        self.payload.cargo(cs)
    }

    fn cargo_payload(&self, cs: A380CargoStation) -> Mass {
        self.payload.cargo_payload(cs)
    }

    fn max_cargo(&self, cs: A380CargoStation) -> Mass {
        self.payload.max_cargo(cs)
    }

    fn sound_pax_boarding_playing(&self) -> bool {
        self.payload.sound_pax_boarding_playing()
    }

    fn sound_pax_deboarding_playing(&self) -> bool {
        self.payload.sound_pax_deboarding_playing()
    }

    fn sound_pax_complete_playing(&self) -> bool {
        self.payload.sound_pax_complete_playing()
    }

    fn sound_pax_ambience_playing(&self) -> bool {
        self.payload.sound_pax_ambience_playing()
    }
}
impl Aircraft for BoardingTestAircraft {
    fn update_before_power_distribution(
        &mut self,
        context: &UpdateContext,
        _electricity: &mut Electricity,
    ) {
        self.payload.update(context);
    }
}
impl SimulationElement for BoardingTestAircraft {
    fn accept<T: SimulationElementVisitor>(&mut self, visitor: &mut T) {
        self.payload.accept(visitor);

        visitor.visit(self);
    }
}

struct BoardingTestBed {
    test_bed: SimulationTestBed<BoardingTestAircraft>,
}
impl BoardingTestBed {
    fn new() -> Self {
        BoardingTestBed {
            test_bed: SimulationTestBed::new(BoardingTestAircraft::new),
        }
    }

    fn and_run(mut self) -> Self {
        self.run();

        self
    }

    fn and_stabilize(mut self) -> Self {
        let five_minutes = 5 * MINUTES_TO_SECONDS;
        self.test_bed
            .run_multiple_frames(Duration::from_secs(five_minutes));

        self
    }

    fn init_vars(mut self) -> Self {
        self.write_by_name("BOARDING_RATE", BoardingRate::Instant);
        self.write_by_name("WB_PER_PAX_WEIGHT", A380Payload::DEFAULT_PER_PAX_WEIGHT_KG);

        self
    }

    fn init_vars_gsx(mut self) -> Self {
        self.write_by_name("GSX_PAYLOAD_SYNC_ENABLED", true);

        self
    }

    fn instant_board_rate(mut self) -> Self {
        self.write_by_name("BOARDING_RATE", BoardingRate::Instant);

        self
    }

    fn fast_board_rate(mut self) -> Self {
        self.write_by_name("BOARDING_RATE", BoardingRate::Fast);

        self
    }

    fn real_board_rate(mut self) -> Self {
        self.write_by_name("BOARDING_RATE", BoardingRate::Real);

        self
    }

    fn gsx_performing_board_state(mut self) -> Self {
        self.write_by_name("FSDT_GSX_BOARDING_STATE", GsxState::Performing);
        self
    }

    fn gsx_performing_deboard_state(mut self) -> Self {
        self.write_by_name("FSDT_GSX_DEBOARDING_STATE", GsxState::Performing);
        self
    }

    fn gsx_complete_board_state(mut self) -> Self {
        self.write_by_name("FSDT_GSX_BOARDING_STATE", GsxState::Completed);
        self
    }

    fn gsx_complete_deboard_state(mut self) -> Self {
        self.write_by_name("FSDT_GSX_DEBOARDING_STATE", GsxState::Completed);
        self
    }

    fn board_gsx_pax_half(mut self) -> Self {
        let mut max_pax = 0;
        for ps in A380PaxStation::iterator() {
            max_pax += test_bed().query(|a| a.max_pax(ps)) as i32;
        }
        self.write_by_name("FSDT_GSX_NUMPASSENGERS_BOARDING_TOTAL", max_pax / 2);
        self
    }

    fn board_gsx_pax_full(mut self) -> Self {
        let mut max_pax = 0;
        for ps in A380PaxStation::iterator() {
            max_pax += test_bed().query(|a| a.max_pax(ps)) as i32;
        }
        self.write_by_name("FSDT_GSX_NUMPASSENGERS_BOARDING_TOTAL", max_pax);
        self
    }

    fn deboard_gsx_pax_half(mut self) -> Self {
        let mut max_pax = 0;
        for ps in A380PaxStation::iterator() {
            max_pax += test_bed().query(|a| a.max_pax(ps)) as i32;
        }
        self.write_by_name("FSDT_GSX_NUMPASSENGERS_DEBOARDING_TOTAL", max_pax / 2);
        self
    }

    fn deboard_gsx_pax_full(mut self) -> Self {
        let mut max_pax = 0;
        for ps in A380PaxStation::iterator() {
            max_pax += test_bed().query(|a| a.max_pax(ps)) as i32;
        }
        self.write_by_name("FSDT_GSX_NUMPASSENGERS_DEBOARDING_TOTAL", max_pax);
        self
    }

    fn board_gsx_cargo_half(mut self) -> Self {
        self.write_by_name("FSDT_GSX_BOARDING_CARGO_PERCENT", 50.);
        self
    }

    fn board_gsx_cargo_full(mut self) -> Self {
        self.write_by_name("FSDT_GSX_BOARDING_CARGO_PERCENT", 100.);
        self
    }

    fn deboard_gsx_cargo_half(mut self) -> Self {
        self.write_by_name("FSDT_GSX_DEBOARDING_CARGO_PERCENT", 50.);
        self
    }

    fn deboard_gsx_cargo_full(mut self) -> Self {
        self.write_by_name("FSDT_GSX_DEBOARDING_CARGO_PERCENT", 100.);
        self
    }

    fn load_pax(&mut self, ps: A380PaxStation, pax_qty: i8) {
        assert!(pax_qty <= A380Payload::A380_PAX[ps].max_pax);

        let per_pax_weight: Mass = Mass::new::<kilogram>(self.read_by_name("WB_PER_PAX_WEIGHT"));

        let seed = 380320;
        let mut rng = rand_pcg::Pcg32::seed_from_u64(seed);

        let binding: Vec<i8> = (0..A380Payload::A380_PAX[ps].max_pax).collect();
        let choices = binding
            .iter()
            .choose_multiple(&mut rng, pax_qty.try_into().unwrap());

        let mut pax_flag: u64 = 0;
        for c in choices {
            pax_flag ^= 1 << c;
        }

        let payload = Mass::new::<pound>(pax_qty as f64 * per_pax_weight.get::<pound>());

        self.write_by_name(&A380Payload::A380_PAX[ps].pax_id, pax_flag);
        self.write_by_name(&A380Payload::A380_PAX[ps].payload_id, payload);
    }

    fn target_pax(&mut self, ps: A380PaxStation, pax_qty: i8) {
        assert!(pax_qty <= A380Payload::A380_PAX[ps].max_pax);

        let seed = 747777;
        let mut rng = rand_pcg::Pcg32::seed_from_u64(seed);

        let binding: Vec<i8> = (0..A380Payload::A380_PAX[ps].max_pax).collect();
        let choices = binding
            .iter()
            .choose_multiple(&mut rng, pax_qty.try_into().unwrap());

        let mut pax_flag: u64 = 0;
        for c in choices {
            pax_flag ^= 1 << c;
        }

        self.write_by_name(
            &format!("{}_DESIRED", &A380Payload::A380_PAX[ps].pax_id),
            pax_flag,
        );
    }

    fn load_cargo(&mut self, cs: A380CargoStation, cargo_qty: Mass) {
        assert!(cargo_qty <= test_bed().query(|a| a.max_cargo(cs)));

        self.write_by_name(
            &A380Payload::A380_CARGO[cs].cargo_id,
            cargo_qty.get::<kilogram>(),
        );
        self.write_by_name(
            &A380Payload::A380_CARGO[cs].payload_id,
            cargo_qty.get::<pound>(),
        );
    }

    fn target_cargo(&mut self, cs: A380CargoStation, cargo_qty: Mass) {
        assert!(cargo_qty <= test_bed().query(|a| a.max_cargo(cs)));

        self.write_by_name(
            &format!("{}_DESIRED", A380Payload::A380_CARGO[cs].cargo_id),
            cargo_qty.get::<kilogram>(),
        );
    }

    fn start_boarding(mut self) -> Self {
        self.write_by_name("BOARDING_STARTED_BY_USR", true);
        self
    }

    fn stop_boarding(mut self) -> Self {
        self.write_by_name("BOARDING_STARTED_BY_USR", false);
        self
    }

    fn boarding_started(&mut self) {
        let is_boarding = self.is_boarding();
        let boarded_var: bool = self.read_by_name("BOARDING_STARTED_BY_USR");
        assert!(is_boarding);
        assert!(boarded_var);

        let pax_boarding_sound: bool = self.read_by_name("SOUND_PAX_BOARDING");
        let pax_deboarding_sound: bool = self.read_by_name("SOUND_PAX_DEBOARDING");
        assert!(self.sound_pax_boarding() || self.sound_pax_deboarding());
        assert!(pax_boarding_sound || pax_deboarding_sound);
    }

    fn boarding_stopped(&mut self) {
        let is_boarding = self.is_boarding();
        let boarded_var: bool = self.read_by_name("BOARDING_STARTED_BY_USR");
        assert!(!is_boarding);
        assert!(!boarded_var);

        let pax_boarding_sound: bool = self.read_by_name("SOUND_PAX_BOARDING");
        let pax_deboarding_sound: bool = self.read_by_name("SOUND_PAX_DEBOARDING");
        assert!(!self.sound_pax_boarding());
        assert!(!self.sound_pax_deboarding());
        assert!(!pax_boarding_sound);
        assert!(!pax_deboarding_sound);
    }

    fn sound_boarding_complete_reset(&mut self) {
        let pax_complete_sound: bool = self.read_by_name("SOUND_BOARDING_COMPLETE");
        assert!(!self.sound_pax_complete());
        assert!(!pax_complete_sound);
    }

    fn has_sound_pax_ambience(&mut self) {
        let pax_ambience: bool = self.read_by_name("SOUND_PAX_AMBIENCE");
        assert!(self.sound_pax_ambience());
        assert!(pax_ambience);
    }

    fn has_no_sound_pax_ambience(&mut self) {
        let pax_ambience: bool = self.read_by_name("SOUND_PAX_AMBIENCE");
        assert!(!self.sound_pax_ambience());
        assert!(!pax_ambience);
    }

    fn with_pax(mut self, ps: A380PaxStation, pax_qty: i8) -> Self {
        self.load_pax(ps, pax_qty);
        self
    }

    fn with_no_pax(mut self) -> Self {
        for ps in A380PaxStation::iterator() {
            self.load_pax(ps, 0);
        }
        self
    }

    fn with_half_pax(mut self) -> Self {
        for ps in A380PaxStation::iterator() {
            self.load_pax(ps, &A380Payload::A380_PAX[ps].max_pax / 2);
        }
        self
    }

    fn with_full_pax(mut self) -> Self {
        for ps in A380PaxStation::iterator() {
            self.load_pax(ps, test_bed().query(|a| a.max_pax(ps)));
        }
        self
    }

    fn with_half_cargo(mut self) -> Self {
        for cs in A380CargoStation::iterator() {
            self.load_cargo(cs, test_bed().query(|a| a.max_cargo(cs)) / 2.);
        }
        self
    }

    fn with_full_cargo(mut self) -> Self {
        for cs in A380CargoStation::iterator() {
            self.load_cargo(cs, test_bed().query(|a| a.max_cargo(cs)));
        }
        self
    }

    fn with_pax_target(mut self, ps: A380PaxStation, pax_qty: i8) -> Self {
        self.target_pax(ps, pax_qty);
        self
    }

    fn target_half_pax(mut self) -> Self {
        for ps in A380PaxStation::iterator() {
            self.target_pax(ps, &A380Payload::A380_PAX[ps].max_pax / 2);
        }
        self
    }

    fn target_full_pax(mut self) -> Self {
        for ps in A380PaxStation::iterator() {
            self.target_pax(ps, test_bed().query(|a| a.max_pax(ps)));
        }
        self
    }

    fn target_no_pax(mut self) -> Self {
        for ps in A380PaxStation::iterator() {
            self.target_pax(ps, 0);
        }
        self
    }

    fn has_no_pax(&self) {
        for ps in A380PaxStation::iterator() {
            let pax_num = 0;
            let pax_payload = Mass::new::<pound>(0.);
            assert_eq!(self.pax_num(ps), pax_num);
            assert_eq!(
                self.pax_payload(ps).get::<pound>().floor(),
                pax_payload.get::<pound>().floor()
            );
        }
    }

    fn has_half_pax(&mut self) {
        let per_pax_weight: Mass = Mass::new::<kilogram>(self.read_by_name("WB_PER_PAX_WEIGHT"));

        for ps in A380PaxStation::iterator() {
            let pax_num = &A380Payload::A380_PAX[ps].max_pax / 2;
            let pax_payload = Mass::new::<pound>(pax_num as f64 * per_pax_weight.get::<pound>());
            assert_eq!(
                self.pax_payload(ps).get::<pound>().floor(),
                pax_payload.get::<pound>().floor()
            );
        }
    }

    fn has_full_pax(&mut self) {
        let per_pax_weight: Mass = Mass::new::<kilogram>(self.read_by_name("WB_PER_PAX_WEIGHT"));

        for ps in A380PaxStation::iterator() {
            let pax_num = test_bed().query(|a| a.max_pax(ps));
            let pax_payload = Mass::new::<pound>(pax_num as f64 * per_pax_weight.get::<pound>());
            assert_eq!(self.pax_num(ps), pax_num);
            assert_eq!(
                self.pax_payload(ps).get::<pound>().floor(),
                pax_payload.get::<pound>().floor()
            );
        }
    }

    fn load_half_cargo(mut self) -> Self {
        for cs in A380CargoStation::iterator() {
            self.load_cargo(cs, test_bed().query(|a| a.max_cargo(cs)) / 2.);
        }
        self
    }

    fn load_full_cargo(mut self) -> Self {
        for cs in A380CargoStation::iterator() {
            self.load_cargo(cs, test_bed().query(|a| a.max_cargo(cs)));
        }
        self
    }

    fn has_no_cargo(&self) {
        for cs in A380CargoStation::iterator() {
            let cargo = Mass::new::<kilogram>(0.);
            assert_eq!(
                self.cargo(cs).get::<kilogram>().floor(),
                cargo.get::<kilogram>().floor(),
            );
            assert_eq!(
                self.cargo_payload(cs).get::<pound>().floor(),
                cargo.get::<pound>().floor()
            );
        }
    }

    fn has_half_cargo(&mut self) {
        let mut total_cargo_payload = Mass::default();
        let mut total_expected_cargo_payload = Mass::default();
        for cs in A380CargoStation::iterator() {
            total_cargo_payload += self.cargo(cs);
            total_expected_cargo_payload += test_bed().query(|a| a.max_cargo(cs)) / 2.;
        }
        assert_eq!(
            total_cargo_payload.get::<pound>().floor(),
            total_expected_cargo_payload.get::<pound>().floor()
        );
    }

    fn has_full_cargo(&mut self) {
        for cs in A380CargoStation::iterator() {
            let cargo = test_bed().query(|a| a.max_cargo(cs));
            assert_eq!(
                self.cargo(cs).get::<kilogram>().floor(),
                cargo.get::<kilogram>().floor(),
            );
            assert_eq!(
                self.cargo_payload(cs).get::<pound>().floor(),
                cargo.get::<pound>().floor()
            );
        }
    }

    fn target_no_cargo(mut self) -> Self {
        for cs in A380CargoStation::iterator() {
            self.target_cargo(cs, Mass::new::<kilogram>(0.));
        }
        self
    }

    fn target_half_cargo(mut self) -> Self {
        for cs in A380CargoStation::iterator() {
            self.target_cargo(cs, test_bed().query(|a| a.max_cargo(cs)) / 2.);
        }
        self
    }

    fn target_full_cargo(mut self) -> Self {
        for cs in A380CargoStation::iterator() {
            self.target_cargo(cs, test_bed().query(|a| a.max_cargo(cs)));
        }
        self
    }

    fn is_boarding(&self) -> bool {
        self.query(|a| a.payload.is_boarding())
    }

    fn board_rate(&self) -> BoardingRate {
        self.query(|a| a.payload.board_rate())
    }

    fn sound_pax_boarding(&self) -> bool {
        self.query(|a| a.sound_pax_boarding_playing())
    }

    fn sound_pax_deboarding(&self) -> bool {
        self.query(|a| a.sound_pax_deboarding_playing())
    }

    fn sound_pax_complete(&self) -> bool {
        self.query(|a| a.sound_pax_complete_playing())
    }

    fn sound_pax_ambience(&self) -> bool {
        self.query(|a: &BoardingTestAircraft| a.sound_pax_ambience_playing())
    }

    fn pax_num(&self, ps: A380PaxStation) -> i8 {
        self.query(|a| a.pax_num(ps))
    }

    fn pax_payload(&self, ps: A380PaxStation) -> Mass {
        self.query(|a| a.pax_payload(ps))
    }

    fn cargo(&self, cs: A380CargoStation) -> Mass {
        self.query(|a| a.cargo(cs))
    }

    fn cargo_payload(&self, cs: A380CargoStation) -> Mass {
        self.query(|a| a.cargo_payload(cs))
    }
}

impl TestBed for BoardingTestBed {
    type Aircraft = BoardingTestAircraft;

    fn test_bed(&self) -> &SimulationTestBed<BoardingTestAircraft> {
        &self.test_bed
    }

    fn test_bed_mut(&mut self) -> &mut SimulationTestBed<BoardingTestAircraft> {
        &mut self.test_bed
    }
}

fn test_bed() -> BoardingTestBed {
    BoardingTestBed::new()
}

fn test_bed_with() -> BoardingTestBed {
    test_bed()
}

#[test]
fn boarding_init() {
    let test_bed = test_bed_with().init_vars();
    assert_eq!(test_bed.board_rate(), BoardingRate::Instant);
    assert!(!test_bed.is_boarding());
    test_bed.has_no_pax();
    test_bed.has_no_cargo();

    assert!(test_bed.contains_variable_with_name("BOARDING_STARTED_BY_USR"));
    assert!(test_bed.contains_variable_with_name("BOARDING_RATE"));
    assert!(test_bed.contains_variable_with_name("WB_PER_PAX_WEIGHT"));
    assert!(test_bed
        .contains_variable_with_name(&&A380Payload::A380_PAX[A380PaxStation::MainFwdA].pax_id));
    assert!(test_bed
        .contains_variable_with_name(&&A380Payload::A380_PAX[A380PaxStation::MainFwdB].pax_id));
    assert!(test_bed
        .contains_variable_with_name(&&A380Payload::A380_PAX[A380PaxStation::MainMid1A].pax_id));
    assert!(test_bed
        .contains_variable_with_name(&&A380Payload::A380_PAX[A380PaxStation::MainMid1B].pax_id));
    assert!(test_bed
        .contains_variable_with_name(&&A380Payload::A380_PAX[A380PaxStation::MainMid1C].pax_id));
    assert!(test_bed
        .contains_variable_with_name(&&A380Payload::A380_PAX[A380PaxStation::MainMid2A].pax_id));
    assert!(test_bed
        .contains_variable_with_name(&&A380Payload::A380_PAX[A380PaxStation::MainMid2B].pax_id));
    assert!(test_bed
        .contains_variable_with_name(&&A380Payload::A380_PAX[A380PaxStation::MainMid2C].pax_id));
    assert!(test_bed
        .contains_variable_with_name(&&A380Payload::A380_PAX[A380PaxStation::MainAftA].pax_id));
    assert!(test_bed
        .contains_variable_with_name(&&A380Payload::A380_PAX[A380PaxStation::MainAftB].pax_id));
    assert!(test_bed
        .contains_variable_with_name(&&A380Payload::A380_PAX[A380PaxStation::UpperFwd].pax_id));
    assert!(test_bed
        .contains_variable_with_name(&&A380Payload::A380_PAX[A380PaxStation::UpperMidA].pax_id));
    assert!(test_bed
        .contains_variable_with_name(&&A380Payload::A380_PAX[A380PaxStation::UpperMidB].pax_id));
    assert!(test_bed
        .contains_variable_with_name(&&A380Payload::A380_PAX[A380PaxStation::UpperAft].pax_id));
    assert!(test_bed
        .contains_variable_with_name(&A380Payload::A380_CARGO[A380CargoStation::Fwd].cargo_id));
    assert!(test_bed
        .contains_variable_with_name(&A380Payload::A380_CARGO[A380CargoStation::Aft].cargo_id));
    assert!(test_bed
        .contains_variable_with_name(&A380Payload::A380_CARGO[A380CargoStation::Bulk].cargo_id));
}
#[test]
fn loaded_no_pax() {
    let mut test_bed = test_bed_with().init_vars().with_no_pax().and_run();

    test_bed.has_no_pax();
    test_bed.has_no_cargo();
    test_bed.boarding_stopped();

    test_bed = test_bed.and_run();
    test_bed.has_no_sound_pax_ambience();
    test_bed.sound_boarding_complete_reset();
}

#[test]
fn loaded_full_pax() {
    let mut test_bed = test_bed_with().init_vars().with_full_pax().and_run();

    test_bed.has_full_pax();
    test_bed.has_no_cargo();
    test_bed.boarding_stopped();

    test_bed = test_bed.and_run();
    test_bed.has_sound_pax_ambience();
    test_bed.sound_boarding_complete_reset();
}

#[test]
fn loaded_half_pax() {
    let mut test_bed = test_bed_with().init_vars().with_half_pax().and_run();

    test_bed.has_half_pax();
    test_bed.has_no_cargo();
    test_bed.boarding_stopped();

    test_bed = test_bed.and_run();
    test_bed.has_sound_pax_ambience();
    test_bed.sound_boarding_complete_reset();
}

#[test]
fn loaded_no_pax_full_cargo() {
    let mut test_bed = test_bed_with()
        .init_vars()
        .with_no_pax()
        .load_full_cargo()
        .and_run();

    test_bed.has_no_pax();
    test_bed.has_full_cargo();
    test_bed.boarding_stopped();

    test_bed = test_bed.and_run();
    test_bed.has_no_sound_pax_ambience();
    test_bed.sound_boarding_complete_reset();
}

#[test]
fn loaded_no_pax_half_cargo() {
    let mut test_bed = test_bed_with()
        .init_vars()
        .with_no_pax()
        .load_half_cargo()
        .and_run();

    test_bed.has_no_pax();
    test_bed.has_half_cargo();
    test_bed.boarding_stopped();

    test_bed = test_bed.and_run();
    test_bed.has_no_sound_pax_ambience();
    test_bed.sound_boarding_complete_reset();
}

#[test]
fn loaded_half_use() {
    let mut test_bed = test_bed_with()
        .init_vars()
        .with_half_pax()
        .load_half_cargo()
        .and_run();

    test_bed.has_half_pax();
    test_bed.has_half_cargo();
    test_bed.boarding_stopped();

    test_bed = test_bed.and_run();
    test_bed.has_sound_pax_ambience();
    test_bed.sound_boarding_complete_reset();
}

#[test]
fn target_half_pre_board() {
    let mut test_bed = test_bed_with()
        .init_vars()
        .target_half_pax()
        .target_half_cargo()
        .and_run()
        .and_stabilize();

    test_bed.has_no_pax();
    test_bed.has_no_cargo();
    test_bed.boarding_stopped();

    test_bed = test_bed.and_run();
    test_bed.has_no_sound_pax_ambience();
    test_bed.sound_boarding_complete_reset();
}

#[test]
fn test_boarding_trigger_reset() {
    let mut test_bed = test_bed_with().init_vars().start_boarding().and_run();
    test_bed.boarding_stopped();
}

#[test]
fn target_half_pax_trigger_and_finish_board() {
    let mut test_bed = test_bed_with()
        .init_vars()
        .target_half_pax()
        .fast_board_rate()
        .start_boarding()
        .and_run()
        .and_stabilize();

    test_bed.has_half_pax();
    test_bed.has_no_cargo();
    test_bed.boarding_stopped();

    test_bed = test_bed.and_run();
    test_bed.has_sound_pax_ambience();
    test_bed.sound_boarding_complete_reset();
}

#[test]
fn target_half_pax_trigger_and_finish_board_realtime_use() {
    let mut test_bed = test_bed_with()
        .init_vars()
        .target_half_pax()
        .real_board_rate()
        .start_boarding()
        .and_run()
        .and_stabilize();

    test_bed.boarding_started();

    let one_hour_in_seconds = HOURS_TO_MINUTES * MINUTES_TO_SECONDS;

    test_bed
        .test_bed
        .run_multiple_frames(Duration::from_secs(one_hour_in_seconds));

    test_bed.has_half_pax();
    test_bed.has_no_cargo();
    test_bed.boarding_stopped();

    test_bed = test_bed.and_run();
    test_bed.has_sound_pax_ambience();
    test_bed.sound_boarding_complete_reset();
}

#[test]
fn loaded_half_idle_pending() {
    let mut test_bed = test_bed_with()
        .init_vars()
        .with_half_pax()
        .load_half_cargo()
        .instant_board_rate()
        .and_run()
        .and_stabilize();

    let fifteen_minutes_in_seconds = 15 * MINUTES_TO_SECONDS;

    test_bed
        .test_bed
        .run_multiple_frames(Duration::from_secs(fifteen_minutes_in_seconds));

    test_bed.has_half_pax();
    test_bed.has_half_cargo();
    test_bed.boarding_stopped();

    test_bed = test_bed.and_run();
    test_bed.has_sound_pax_ambience();
    test_bed.sound_boarding_complete_reset();
}

#[test]
fn target_half_and_board() {
    let mut test_bed = test_bed_with()
        .init_vars()
        .target_half_pax()
        .target_half_cargo()
        .fast_board_rate()
        .start_boarding()
        .and_run()
        .and_stabilize();

    test_bed.has_half_pax();
    test_bed.has_half_cargo();
    test_bed.boarding_stopped();

    test_bed = test_bed.and_run();
    test_bed.has_sound_pax_ambience();
    test_bed.sound_boarding_complete_reset();
}

#[test]
fn target_half_and_board_fifteen_minutes_idle() {
    let mut test_bed = test_bed_with()
        .init_vars()
        .target_half_pax()
        .target_half_cargo()
        .fast_board_rate()
        .start_boarding()
        .and_run();

    test_bed.boarding_started();

    let fifteen_minutes_in_seconds = 15 * MINUTES_TO_SECONDS;

    test_bed
        .test_bed
        .run_multiple_frames(Duration::from_secs(fifteen_minutes_in_seconds));

    test_bed.has_half_pax();
    test_bed.has_half_cargo();
    test_bed.boarding_stopped();

    test_bed = test_bed.and_run();
    test_bed.has_sound_pax_ambience();
    test_bed.sound_boarding_complete_reset();
}

#[test]
fn target_half_and_board_instant() {
    let mut test_bed = test_bed_with()
        .init_vars()
        .target_half_pax()
        .target_half_cargo()
        .instant_board_rate()
        .start_boarding()
        .and_run();

    test_bed.has_half_pax();
    test_bed.has_half_cargo();
    test_bed.boarding_stopped();

    test_bed = test_bed.and_run();
    test_bed.has_sound_pax_ambience();
    test_bed.sound_boarding_complete_reset();
}

#[test]
fn start_half_pax_target_full_pax_fast_board() {
    let mut test_bed = test_bed_with()
        .init_vars()
        .with_half_pax()
        .load_half_cargo()
        .target_full_pax()
        .target_half_cargo()
        .fast_board_rate()
        .start_boarding()
        .and_run()
        .and_stabilize();

    test_bed.has_full_pax();
    test_bed.has_half_cargo();
    test_bed.boarding_stopped();

    test_bed = test_bed.and_run();
    test_bed.has_sound_pax_ambience();
    test_bed.sound_boarding_complete_reset();
}

#[test]
fn start_half_cargo_target_full_cargo_real_board() {
    let mut test_bed = test_bed_with()
        .init_vars()
        .with_half_pax()
        .load_half_cargo()
        .target_half_pax()
        .target_full_cargo()
        .real_board_rate()
        .start_boarding()
        .and_run()
        .and_stabilize();

    test_bed.boarding_started();

    let one_hour_in_seconds = HOURS_TO_MINUTES * MINUTES_TO_SECONDS;

    test_bed
        .test_bed
        .run_multiple_frames(Duration::from_secs(one_hour_in_seconds));

    test_bed.has_half_pax();
    test_bed.has_full_cargo();
    test_bed.boarding_stopped();

    test_bed = test_bed.and_run();
    test_bed.has_sound_pax_ambience();
    test_bed.sound_boarding_complete_reset();
}

#[test]
fn start_half_target_full_instantly() {
    let mut test_bed = test_bed_with()
        .init_vars()
        .with_half_pax()
        .load_half_cargo()
        .target_full_pax()
        .target_full_cargo()
        .instant_board_rate()
        .start_boarding()
        .and_run();

    test_bed.has_full_pax();
    test_bed.has_full_cargo();
    test_bed.boarding_stopped();

    test_bed = test_bed.and_run();
    test_bed.has_sound_pax_ambience();
    test_bed.sound_boarding_complete_reset();
}

#[test]
fn deboard_full_pax_full_cargo_idle_pending() {
    let mut test_bed = test_bed_with()
        .init_vars()
        .with_full_pax()
        .load_full_cargo()
        .target_no_pax()
        .target_no_cargo()
        .fast_board_rate()
        .and_run()
        .and_stabilize();

    test_bed.has_full_pax();
    test_bed.has_full_cargo();
    test_bed.boarding_stopped();

    test_bed = test_bed.and_run();
    test_bed.has_sound_pax_ambience();
    test_bed.sound_boarding_complete_reset();
}

#[test]
fn deboard_full_pax_full_cargo_fast() {
    let mut test_bed = test_bed_with()
        .init_vars()
        .with_full_pax()
        .load_full_cargo()
        .target_no_pax()
        .target_no_cargo()
        .fast_board_rate()
        .start_boarding()
        .and_run()
        .and_stabilize();

    let ninety_minutes_in_seconds = 90 * MINUTES_TO_SECONDS;

    test_bed
        .test_bed
        .run_multiple_frames(Duration::from_secs(ninety_minutes_in_seconds));

    test_bed.has_no_pax();
    test_bed.has_no_cargo();
    test_bed.boarding_stopped();

    test_bed = test_bed.and_run();
    test_bed.has_no_sound_pax_ambience();
    test_bed.sound_boarding_complete_reset();
}

#[test]
fn deboard_half_pax_full_cargo_instantly() {
    let mut test_bed = test_bed_with()
        .init_vars()
        .with_half_pax()
        .load_full_cargo()
        .target_no_pax()
        .target_no_cargo()
        .instant_board_rate()
        .start_boarding()
        .and_run();

    test_bed.has_no_pax();
    test_bed.has_no_cargo();
    test_bed.boarding_stopped();

    test_bed = test_bed.and_run();
    test_bed.has_no_sound_pax_ambience();
    test_bed.sound_boarding_complete_reset();
}

#[test]
fn deboard_half_real() {
    let mut test_bed = test_bed_with()
        .init_vars()
        .with_half_pax()
        .load_half_cargo()
        .target_no_pax()
        .target_no_cargo()
        .real_board_rate()
        .start_boarding()
        .and_run()
        .and_stabilize();

    test_bed.boarding_started();

    let ninety_minutes_in_seconds = 90 * MINUTES_TO_SECONDS;

    test_bed
        .test_bed
        .run_multiple_frames(Duration::from_secs(ninety_minutes_in_seconds));

    test_bed.has_no_pax();
    test_bed.has_no_cargo();
    test_bed.boarding_stopped();

    test_bed = test_bed.and_run();
    test_bed.has_no_sound_pax_ambience();
    test_bed.sound_boarding_complete_reset();
}

#[test]
fn deboard_half_five_min_change_to_board_full_real() {
    let mut test_bed = test_bed_with()
        .init_vars()
        .with_half_pax()
        .load_half_cargo()
        .target_no_pax()
        .target_no_cargo()
        .real_board_rate()
        .start_boarding()
        .and_run();

    test_bed.boarding_started();

    test_bed = test_bed
        .and_stabilize()
        .target_full_pax()
        .target_full_cargo();

    let ninety_minutes_in_seconds = 90 * MINUTES_TO_SECONDS;

    test_bed
        .test_bed
        .run_multiple_frames(Duration::from_secs(ninety_minutes_in_seconds));

    test_bed.has_full_pax();
    test_bed.has_full_cargo();
    test_bed.boarding_stopped();

    test_bed = test_bed.and_run();
    test_bed.has_sound_pax_ambience();
    test_bed.sound_boarding_complete_reset();
}

#[test]
fn deboard_half_two_min_change_instant() {
    let mut test_bed = test_bed_with()
        .init_vars()
        .with_half_pax()
        .load_half_cargo()
        .target_no_pax()
        .target_no_cargo()
        .real_board_rate()
        .start_boarding()
        .and_run()
        .and_stabilize();

    test_bed.boarding_started();

    test_bed = test_bed.instant_board_rate().and_run();

    test_bed.has_no_pax();
    test_bed.has_no_cargo();
    test_bed.boarding_stopped();

    test_bed = test_bed.and_run();
    test_bed.has_no_sound_pax_ambience();
    test_bed.sound_boarding_complete_reset();
}

#[test]
fn deboard_half_two_min_change_instant_change_units_load_full_kg() {
    let mut test_bed = test_bed_with()
        .init_vars()
        .with_half_pax()
        .load_half_cargo()
        .target_no_pax()
        .target_no_cargo()
        .real_board_rate()
        .start_boarding()
        .and_run()
        .and_stabilize();

    test_bed.boarding_started();

    test_bed = test_bed
        .init_vars()
        .target_full_cargo()
        .instant_board_rate()
        .and_run();

    test_bed.has_no_pax();
    test_bed.has_full_cargo();
    test_bed.boarding_stopped();

    test_bed = test_bed.and_run();
    test_bed.has_no_sound_pax_ambience();
    test_bed.sound_boarding_complete_reset();
}

#[test]
fn detailed_test_with_multiple_stops() {
    let mut test_bed = test_bed_with()
        .init_vars()
        .with_pax(A380PaxStation::MainFwdA, 5)
        .with_pax(A380PaxStation::MainFwdB, 1)
        .with_pax(A380PaxStation::MainMid1A, 16)
        .with_pax(A380PaxStation::MainMid1B, 16)
        .with_pax(A380PaxStation::MainMid1C, 16)
        .with_pax_target(A380PaxStation::MainMid2A, 15)
        .with_pax_target(A380PaxStation::MainMid2B, 14)
        .with_pax_target(A380PaxStation::MainMid2C, 25)
        .with_pax_target(A380PaxStation::MainAftA, 12)
        .with_pax_target(A380PaxStation::MainAftB, 12)
        .with_pax_target(A380PaxStation::UpperFwd, 12)
        .with_pax_target(A380PaxStation::UpperMidA, 14)
        .with_pax_target(A380PaxStation::UpperMidB, 14)
        .with_pax_target(A380PaxStation::UpperAft, 6)
        .load_half_cargo()
        .real_board_rate()
        .start_boarding()
        .and_run()
        .and_stabilize();

    test_bed = test_bed.stop_boarding().and_run();

    test_bed.boarding_stopped();

    test_bed = test_bed.start_boarding().and_run();

    let forty_five_minutes_in_seconds = 45 * MINUTES_TO_SECONDS;

    test_bed
        .test_bed
        .run_multiple_frames(Duration::from_secs(forty_five_minutes_in_seconds));

    assert_eq!(test_bed.pax_num(A380PaxStation::MainFwdA), 0);
    assert_eq!(test_bed.pax_num(A380PaxStation::MainFwdB), 0);
    assert_eq!(test_bed.pax_num(A380PaxStation::MainMid1A), 0);
    assert_eq!(test_bed.pax_num(A380PaxStation::MainMid1B), 0);
    assert_eq!(test_bed.pax_num(A380PaxStation::MainMid1C), 0);
    assert_eq!(test_bed.pax_num(A380PaxStation::MainMid2A), 15);
    assert_eq!(test_bed.pax_num(A380PaxStation::MainMid2B), 14);
    assert_eq!(test_bed.pax_num(A380PaxStation::MainMid2C), 25);
    assert_eq!(test_bed.pax_num(A380PaxStation::MainAftA), 12);
    assert_eq!(test_bed.pax_num(A380PaxStation::MainAftB), 12);
    assert_eq!(test_bed.pax_num(A380PaxStation::UpperFwd), 12);
    assert_eq!(test_bed.pax_num(A380PaxStation::UpperMidA), 14);
    test_bed.has_no_cargo();

    test_bed = test_bed
        .init_vars()
        .target_no_pax()
        .target_half_cargo()
        .instant_board_rate()
        .start_boarding()
        .and_run()
        .and_stabilize();

    test_bed.has_no_pax();
    test_bed.has_half_cargo();
    test_bed.boarding_stopped();

    test_bed = test_bed.and_run();
    test_bed.has_no_sound_pax_ambience();
    test_bed.sound_boarding_complete_reset();
}

#[test]
fn disable_if_gsx_enabled() {
    let mut test_bed = test_bed_with()
        .init_vars()
        .init_vars_gsx()
        .target_half_pax()
        .target_full_cargo()
        .real_board_rate()
        .start_boarding()
        .and_run()
        .and_stabilize();

    let one_hour_in_seconds = HOURS_TO_MINUTES * MINUTES_TO_SECONDS;

    test_bed
        .test_bed
        .run_multiple_frames(Duration::from_secs(one_hour_in_seconds));

    test_bed.has_no_pax();
    test_bed.has_no_cargo();
    test_bed.boarding_stopped();

    test_bed = test_bed.and_run();
    test_bed.has_no_sound_pax_ambience();
    test_bed.sound_boarding_complete_reset();
}

#[test]
fn gsx_boarding_half_pax() {
    let mut test_bed = test_bed_with()
        .init_vars()
        .init_vars_gsx()
        .target_half_pax()
        .target_half_cargo()
        .gsx_performing_board_state()
        .board_gsx_pax_half()
        .board_gsx_cargo_half()
        .and_run()
        .gsx_complete_board_state()
        .and_stabilize();

    test_bed.has_half_pax();
    test_bed.has_half_cargo();

    test_bed = test_bed.and_run();
    test_bed.has_sound_pax_ambience();
    test_bed.sound_boarding_complete_reset();
}

#[test]
fn gsx_boarding_full_pax() {
    let mut test_bed = test_bed_with()
        .init_vars()
        .init_vars_gsx()
        .target_full_pax()
        .target_full_cargo()
        .gsx_performing_board_state()
        .board_gsx_pax_half()
        .board_gsx_cargo_half()
        .and_run()
        .and_stabilize()
        .board_gsx_pax_full()
        .board_gsx_cargo_full()
        .and_run()
        .gsx_complete_board_state();

    test_bed.has_full_pax();
    test_bed.has_full_cargo();

    test_bed = test_bed.and_run();
    test_bed.has_sound_pax_ambience();
    test_bed.sound_boarding_complete_reset();
}

#[test]
fn gsx_deboarding_full_pax() {
    let mut test_bed = test_bed_with()
        .init_vars()
        .init_vars_gsx()
        .with_full_pax()
        .with_full_cargo()
        .target_no_pax()
        .target_no_cargo()
        .gsx_performing_deboard_state()
        .deboard_gsx_pax_half()
        .deboard_gsx_cargo_half()
        .and_run()
        .and_stabilize()
        .deboard_gsx_pax_full()
        .deboard_gsx_cargo_full()
        .and_run()
        .gsx_complete_deboard_state();

    test_bed.has_no_pax();
    test_bed.has_no_cargo();

    test_bed = test_bed.and_run();
    test_bed.has_no_sound_pax_ambience();
    test_bed.sound_boarding_complete_reset();
}

#[test]
fn gsx_deboarding_half_pax() {
    let mut test_bed = test_bed_with()
        .init_vars()
        .init_vars_gsx()
        .with_half_pax()
        .with_half_cargo()
        .target_no_pax()
        .target_no_cargo()
        .gsx_performing_deboard_state()
        .deboard_gsx_pax_half()
        .deboard_gsx_cargo_half()
        .and_run()
        .and_stabilize()
        .deboard_gsx_pax_full()
        .deboard_gsx_cargo_full()
        .and_run()
        .gsx_complete_deboard_state();

    test_bed.has_no_pax();
    test_bed.has_no_cargo();

    test_bed = test_bed.and_run();
    test_bed.has_no_sound_pax_ambience();
    test_bed.sound_boarding_complete_reset();
}