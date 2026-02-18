import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type Day = {
    dayNumber : Nat;
    activity : Text;
    description : Text;
  };

  type DayProgress = {
    dayNumber : Nat;
    completed : Bool;
  };

  type Program = {
    title : Text;
    description : Text;
    days : [Day];
  };

  type DailyProgress = {
    completedDays : [Nat];
  };

  type UserProfile = {
    name : Text;
  };

  var program : Program = {
    title = "30 Day Bootcamp";
    description = "A 30-day program to improve your skills step by step.";
    days = Array.tabulate<Day>(
      30,
      func(i) {
        let dayNum = i + 1;
        {
          dayNumber = dayNum;
          activity = "Activity " # dayNum.toText();
          description = "Detailed instructions for day " # dayNum.toText();
        };
      },
    );
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let userProgress = Map.empty<Principal, DailyProgress>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getProgram() : async Program {
    program;
  };

  public query ({ caller }) func getDay(dayNumber : Nat) : async Day {
    assert dayNumber >= 1 and dayNumber <= 30;
    program.days[dayNumber - 1];
  };

  public query ({ caller }) func getDaysRange(startDay : Nat, endDay : Nat) : async [Day] {
    assert startDay >= 1 and endDay <= 30 and startDay <= endDay;
    program.days.sliceToArray(startDay - 1, endDay);
  };

  public query ({ caller }) func getProgramStats() : async {
    totalDays : Nat;
    completedCount : Nat;
    remainingCount : Nat;
  } {
    {
      totalDays = 30;
      completedCount = 0;
      remainingCount = 30;
    };
  };

  public query ({ caller }) func getMyProgress() : async DailyProgress {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access their progress");
    };

    switch (userProgress.get(caller)) {
      case (?progress) { progress };
      case (null) {
        {
          completedDays = [];
        };
      };
    };
  };

  public query ({ caller }) func getDayProgress(dayNumber : Nat) : async DayProgress {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access their day progress");
    };

    let progress = switch (userProgress.get(caller)) {
      case (?progress) { progress };
      case (null) { { completedDays = [] } };
    };

    {
      dayNumber;
      completed = progress.completedDays.any(func(x) { x == dayNumber });
    };
  };

  public shared ({ caller }) func markDayComplete(dayNumber : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can mark a day complete");
    };

    assert dayNumber >= 1 and dayNumber <= 30;

    let updatedProgress = switch (userProgress.get(caller)) {
      case (?progress) {
        if (progress.completedDays.any(func(x) { x == dayNumber })) {
          progress;
        } else {
          {
            completedDays = progress.completedDays.concat([dayNumber]);
          };
        };
      };
      case (null) {
        {
          completedDays = [dayNumber];
        };
      };
    };

    userProgress.add(caller, updatedProgress);
  };

  public shared ({ caller }) func resetMyProgress() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can reset progress");
    };

    userProgress.remove(caller);
  };
};
