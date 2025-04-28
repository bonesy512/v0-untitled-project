"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, Heart, AlertCircle, Plus, X, Calendar, Clock } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { format } from "date-fns"
import { useToast } from "@/components/ui/use-toast"

type Milestone = {
  id: string
  date: string
  description: string
  type: string
}

export default function SituationshipDecoder() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    // Basic Information
    duration: "",
    frequency: "",
    communication: "",
    emotionalIntensity: "",
    expectations: "",
    behaviors: "",
    feelings: "",
    physicalIntimacy: "",

    // Trust & Security
    trustLevel: "",
    jealousy: "",
    transparency: "",

    // Emotional Connection
    emotionalSupport: "",
    vulnerability: "",
    empathy: "",

    // Future & Commitment
    futureDiscussions: "",
    lifeGoals: "",
    commitmentLevel: "",

    // Conflict Resolution
    conflictFrequency: "",
    conflictResolution: "",
    afterConflict: "",

    // Balance & Boundaries
    personalSpace: "",
    socialDynamics: "",
    boundaries: "",

    // Additional Context
    additionalContext: "",
    userBirthday: "",
    partnerBirthday: "",
  })

  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [newMilestone, setNewMilestone] = useState<{
    date: string
    description: string
    type: string
  }>({
    date: "",
    description: "",
    type: "positive",
  })

  const [activeTab, setActiveTab] = useState("basic")
  const [decode, setDecode] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  // Basic Information Options
  const durationOptions = ["Less than a month", "1-3 months", "3-6 months", "6-12 months", "More than a year"]
  const frequencyOptions = ["Rarely", "Monthly", "Weekly", "Daily", "Multiple times a day"]
  const communicationOptions = ["Social media", "Texting", "Calling", "Video calls", "In-person"]
  const emotionalIntensityOptions = [
    "Very casual",
    "Casual",
    "Friendly",
    "Warm",
    "Affectionate",
    "Passionate",
    "Intense",
  ]
  const expectationsOptions = [
    "Casual fun",
    "Friends with benefits",
    "Exploring possibilities",
    "Potential relationship",
    "In a relationship",
    "Committed partnership",
    "Engaged",
    "Married",
  ]
  const behaviorsOptions = [
    "Ghosting",
    "Breadcrumbing",
    "Mixed signals",
    "Occasionally inconsistent",
    "Mostly consistent",
    "Consistent and reliable",
  ]
  const feelingsOptions = [
    "Unhappy",
    "Indifferent",
    "Confused",
    "Anxious",
    "Frustrated",
    "Hopeful",
    "Content",
    "Happy",
    "Very happy",
  ]
  const physicalIntimacyOptions = [
    "None",
    "Minimal (holding hands, hugging)",
    "Light (kissing, cuddling)",
    "Moderate (making out, some touching)",
    "Intimate (sexual activity)",
    "Very intimate (regular sexual activity)",
  ]

  // Trust & Security Options
  const trustLevelOptions = [
    "No trust",
    "Very little trust",
    "Some trust with reservations",
    "Moderate trust",
    "High trust",
    "Complete trust",
  ]
  const jealousyOptions = [
    "Extreme jealousy",
    "Frequent jealousy",
    "Occasional jealousy",
    "Rare jealousy",
    "No jealousy",
  ]
  const transparencyOptions = [
    "No transparency",
    "Limited transparency",
    "Selective transparency",
    "Mostly transparent",
    "Completely transparent",
  ]

  // Emotional Connection Options
  const emotionalSupportOptions = [
    "No support",
    "Minimal support",
    "Occasional support",
    "Regular support",
    "Consistent strong support",
  ]
  const vulnerabilityOptions = [
    "Cannot be vulnerable",
    "Rarely vulnerable",
    "Sometimes vulnerable",
    "Often vulnerable",
    "Completely open and vulnerable",
  ]
  const empathyOptions = [
    "No empathy shown",
    "Little empathy",
    "Selective empathy",
    "Good empathy",
    "Strong empathy and understanding",
  ]

  // Future & Commitment Options
  const futureDiscussionsOptions = [
    "Never discuss future",
    "Rarely discuss future",
    "Sometimes discuss future",
    "Often discuss future",
    "Regularly plan for future together",
  ]
  const lifeGoalsOptions = [
    "Completely misaligned",
    "Mostly different goals",
    "Some shared goals",
    "Many shared goals",
    "Completely aligned life goals",
  ]
  const commitmentLevelOptions = [
    "No commitment",
    "Very low commitment",
    "Moderate commitment",
    "Strong commitment",
    "Full commitment",
  ]

  // Conflict Resolution Options
  const conflictFrequencyOptions = [
    "Constant conflicts",
    "Frequent conflicts",
    "Occasional conflicts",
    "Rare conflicts",
    "Almost never conflict",
  ]
  const conflictResolutionOptions = [
    "Never resolve conflicts",
    "Poorly resolve conflicts",
    "Sometimes resolve conflicts",
    "Usually resolve conflicts well",
    "Always resolve conflicts healthily",
  ]
  const afterConflictOptions = [
    "Relationship worsens",
    "Lingering tension",
    "Return to normal",
    "Better understanding",
    "Stronger relationship",
  ]

  // Balance & Boundaries Options
  const personalSpaceOptions = [
    "No personal space",
    "Little personal space",
    "Some personal space",
    "Good balance",
    "Perfect balance of togetherness and independence",
  ]
  const socialDynamicsOptions = [
    "Completely separate social lives",
    "Rarely interact with each other's friends",
    "Sometimes socialize together",
    "Often socialize together",
    "Fully integrated social lives",
  ]
  const boundariesOptions = [
    "No boundaries respected",
    "Few boundaries respected",
    "Some boundaries respected",
    "Most boundaries respected",
    "All boundaries respected",
  ]

  // Milestone Types
  const milestoneTypeOptions = [
    { value: "positive", label: "Positive", color: "bg-green-100 text-green-800 border-green-200" },
    { value: "neutral", label: "Neutral", color: "bg-blue-100 text-blue-800 border-blue-200" },
    { value: "challenging", label: "Challenging", color: "bg-amber-100 text-amber-800 border-amber-200" },
    { value: "negative", label: "Negative", color: "bg-red-100 text-red-800 border-red-200" },
  ]

  const positiveOptions = {
    // Basic Information
    duration: ["6-12 months", "More than a year"],
    frequency: ["Daily", "Multiple times a day"],
    communication: ["In-person", "Video calls"],
    emotionalIntensity: ["Affectionate", "Passionate", "Intense"],
    expectations: ["In a relationship", "Committed partnership", "Engaged", "Married"],
    behaviors: ["Mostly consistent", "Consistent and reliable"],
    feelings: ["Hopeful", "Content", "Happy", "Very happy"],
    physicalIntimacy: [
      "Moderate (making out, some touching)",
      "Intimate (sexual activity)",
      "Very intimate (regular sexual activity)",
    ],

    // Trust & Security
    trustLevel: ["High trust", "Complete trust"],
    jealousy: ["Rare jealousy", "No jealousy"],
    transparency: ["Mostly transparent", "Completely transparent"],

    // Emotional Connection
    emotionalSupport: ["Regular support", "Consistent strong support"],
    vulnerability: ["Often vulnerable", "Completely open and vulnerable"],
    empathy: ["Good empathy", "Strong empathy and understanding"],

    // Future & Commitment
    futureDiscussions: ["Often discuss future", "Regularly plan for future together"],
    lifeGoals: ["Many shared goals", "Completely aligned life goals"],
    commitmentLevel: ["Strong commitment", "Full commitment"],

    // Conflict Resolution
    conflictFrequency: ["Rare conflicts", "Almost never conflict"],
    conflictResolution: ["Usually resolve conflicts well", "Always resolve conflicts healthily"],
    afterConflict: ["Better understanding", "Stronger relationship"],

    // Balance & Boundaries
    personalSpace: ["Good balance", "Perfect balance of togetherness and independence"],
    socialDynamics: ["Often socialize together", "Fully integrated social lives"],
    boundaries: ["Most boundaries respected", "All boundaries respected"],
  }

  const getZodiac = (date) => {
    if (!date) return ""
    const [year, month, day] = date.split("-").map(Number)
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius"
    if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return "Pisces"
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries"
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus"
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini"
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer"
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo"
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo"
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra"
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio"
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius"
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricorn"
    return ""
  }

  const getCompatibility = (sign1, sign2) => {
    const elements = {
      Aries: "Fire",
      Leo: "Fire",
      Sagittarius: "Fire",
      Taurus: "Earth",
      Virgo: "Earth",
      Capricorn: "Earth",
      Gemini: "Air",
      Libra: "Air",
      Aquarius: "Air",
      Cancer: "Water",
      Scorpio: "Water",
      Pisces: "Water",
    }

    if (!sign1 || !sign2) return ""

    const element1 = elements[sign1]
    const element2 = elements[sign2]

    if (element1 === element2) return "highly compatible"
    if (
      (element1 === "Fire" && element2 === "Air") ||
      (element1 === "Air" && element2 === "Fire") ||
      (element1 === "Earth" && element2 === "Water") ||
      (element1 === "Water" && element2 === "Earth")
    )
      return "complementary"

    return "may face challenges but can grow together"
  }

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleMilestoneChange = (field, value) => {
    setNewMilestone((prev) => ({ ...prev, [field]: value }))
  }

  const addMilestone = () => {
    if (!newMilestone.date || !newMilestone.description) {
      toast({
        title: "Missing information",
        description: "Please enter both a date and description for the milestone",
        variant: "destructive",
      })
      return
    }

    const milestone = {
      id: Date.now().toString(),
      ...newMilestone,
    }

    setMilestones((prev) =>
      [...prev, milestone].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    )
    setNewMilestone({
      date: "",
      description: "",
      type: "positive",
    })
  }

  const removeMilestone = (id) => {
    setMilestones((prev) => prev.filter((milestone) => milestone.id !== id))
  }

  const calculateProgress = () => {
    const allFields = Object.keys(formData).filter(
      (key) => key !== "additionalContext" && key !== "userBirthday" && key !== "partnerBirthday",
    )
    const filledFields = allFields.filter((key) => formData[key] !== "")
    return Math.round((filledFields.length / allFields.length) * 100)
  }

  const handleTabChange = (value) => {
    setActiveTab(value)
    setProgress(calculateProgress())
  }

  const getMilestoneTypeColor = (type) => {
    return milestoneTypeOptions.find((option) => option.value === type)?.color || "bg-gray-100 text-gray-800"
  }

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy")
    } catch (e) {
      return dateString
    }
  }

  const handleDecode = async () => {
    // Basic fields are required, other categories are optional but will enhance the analysis
    const requiredFields = [
      "duration",
      "frequency",
      "communication",
      "emotionalIntensity",
      "expectations",
      "behaviors",
      "feelings",
      "physicalIntimacy",
    ]

    const isFormValid = requiredFields.every((field) => formData[field] !== "")
    if (!isFormValid) {
      toast({
        title: "Missing information",
        description: "Please fill all required fields in the Basic Information tab",
        variant: "destructive",
      })
      setActiveTab("basic")
      return
    }

    setLoading(true)

    try {
      // In a real app, this would be an API call to generate insights
      // For now, we'll simulate the processing time and response
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Generate deep psychological insights based on the data
      const analysisData = {
        formData,
        milestones,
      }

      // This would be the response from the AI service
      const analysisResult = generateDeepInsights(analysisData)

      setDecode(analysisResult)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate relationship insights. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // This function simulates the AI-generated deep insights
  const generateDeepInsights = (data) => {
    const { formData, milestones } = data

    let positiveCount = 0
    let totalFields = 0

    for (const field in positiveOptions) {
      if (formData[field] !== "") {
        totalFields++
        if (positiveOptions[field].includes(formData[field])) {
          positiveCount++
        }
      }
    }

    const positivePercentage = (positiveCount / totalFields) * 100

    let decodeMessage
    let icon
    let relationshipType
    const strengths = []
    const challenges = []
    let attachmentStyle = ""
    let communicationPattern = ""
    let powerDynamics = ""
    let growthPotential = ""

    // Determine relationship strengths
    if (positiveOptions.emotionalSupport.includes(formData.emotionalSupport)) strengths.push("emotional support")
    if (positiveOptions.trustLevel.includes(formData.trustLevel)) strengths.push("trust")
    if (positiveOptions.conflictResolution.includes(formData.conflictResolution)) strengths.push("conflict resolution")
    if (positiveOptions.boundaries.includes(formData.boundaries)) strengths.push("healthy boundaries")
    if (positiveOptions.empathy.includes(formData.empathy)) strengths.push("empathy")

    // Determine relationship challenges
    if (!positiveOptions.communication.includes(formData.communication)) challenges.push("communication")
    if (!positiveOptions.expectations.includes(formData.expectations)) challenges.push("alignment of expectations")
    if (!positiveOptions.behaviors.includes(formData.behaviors)) challenges.push("consistency")
    if (!positiveOptions.futureDiscussions.includes(formData.futureDiscussions)) challenges.push("future planning")
    if (!positiveOptions.transparency.includes(formData.transparency)) challenges.push("transparency")

    // Determine attachment style based on trust, vulnerability, and behaviors
    if (formData.trustLevel === "Complete trust" && formData.vulnerability === "Completely open and vulnerable") {
      attachmentStyle =
        "Secure attachment style, characterized by comfort with intimacy and independence. This creates a stable foundation for emotional connection and mutual growth."
    } else if (formData.trustLevel === "No trust" || formData.trustLevel === "Very little trust") {
      attachmentStyle =
        "Anxious-avoidant attachment pattern, marked by difficulty trusting and fear of vulnerability. This creates a push-pull dynamic that can be emotionally exhausting for both partners."
    } else if (formData.vulnerability === "Cannot be vulnerable" || formData.vulnerability === "Rarely vulnerable") {
      attachmentStyle =
        "Dismissive-avoidant attachment tendencies, characterized by emotional distance and self-reliance. This creates challenges in developing deep emotional intimacy."
    } else {
      attachmentStyle =
        "Mixed attachment patterns that fluctuate based on circumstances. This suggests potential for growth toward more secure attachment through consistent positive interactions."
    }

    // Determine communication pattern
    if (
      formData.communication === "In-person" &&
      positiveOptions.conflictResolution.includes(formData.conflictResolution)
    ) {
      communicationPattern =
        "Direct and constructive communication pattern that facilitates understanding and problem-solving. Your ability to address issues face-to-face strengthens your connection."
    } else if (formData.communication === "Texting" && formData.conflictResolution === "Never resolve conflicts") {
      communicationPattern =
        "Avoidant communication pattern that may prevent deeper understanding. Text-based communication can mask emotional nuances and lead to misinterpretations."
    } else {
      communicationPattern =
        "Mixed communication style that varies in effectiveness. Consider establishing communication agreements about how and when to discuss important matters."
    }

    // Analyze milestones
    let milestoneInsight = ""
    let relationshipTrajectory = ""

    if (milestones.length > 0) {
      const sortedMilestones = [...milestones].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      const firstMilestone = sortedMilestones[0]
      const lastMilestone = sortedMilestones[sortedMilestones.length - 1]
      const positiveCount = sortedMilestones.filter((m) => m.type === "positive").length
      const negativeCount = sortedMilestones.filter((m) => m.type === "negative").length
      const challengingCount = sortedMilestones.filter((m) => m.type === "challenging").length

      milestoneInsight = `\n\nRelationship Timeline Analysis: Your relationship journey from ${formatDate(
        firstMilestone.date,
      )} to ${formatDate(lastMilestone.date)} reveals important patterns. `

      // Analyze relationship trajectory
      const recentMilestones = sortedMilestones.slice(-3)
      const recentPositive = recentMilestones.filter((m) => m.type === "positive").length
      const recentNegative = recentMilestones.filter((m) => m.type === "negative").length
      const recentChallenging = recentMilestones.filter((m) => m.type === "challenging").length

      if (positiveCount > negativeCount + challengingCount) {
        milestoneInsight +=
          "Your relationship demonstrates resilience and a predominantly positive trajectory, which research associates with relationship longevity. "

        if (recentPositive > recentNegative + recentChallenging) {
          relationshipTrajectory = "upward"
          milestoneInsight += "The recent positive events suggest continued growth and deepening connection."
        } else {
          relationshipTrajectory = "plateau"
          milestoneInsight +=
            "While your foundation is strong, recent challenges suggest a need for renewed attention to nurturing your connection."
        }
      } else if (negativeCount > positiveCount) {
        milestoneInsight +=
          "Your relationship history shows recurring negative patterns that may be creating emotional distance. "

        if (recentPositive > recentNegative) {
          relationshipTrajectory = "recovering"
          milestoneInsight +=
            "However, recent positive developments suggest potential for healing and renewal if you continue this momentum."
        } else {
          relationshipTrajectory = "downward"
          milestoneInsight +=
            "The continued negative experiences suggest a need for significant intervention, possibly including professional support."
        }
      } else {
        milestoneInsight +=
          "Your relationship shows a mix of positive moments and challenges, reflecting normal relationship complexity. "

        if (recentChallenging > recentPositive && recentChallenging > recentNegative) {
          relationshipTrajectory = "transformative"
          milestoneInsight +=
            "Recent challenges appear to be catalysts for growth rather than signs of deterioration, suggesting potential for transformation."
        } else {
          relationshipTrajectory = "fluctuating"
          milestoneInsight +=
            "The fluctuating nature of your experiences suggests a need for more intentional relationship maintenance."
        }
      }
    }

    // Determine power dynamics
    if (formData.personalSpace === "No personal space" && formData.boundaries === "No boundaries respected") {
      powerDynamics =
        "Imbalanced power dynamic with potential controlling behaviors. Healthy relationships require mutual respect for boundaries and personal autonomy."
    } else if (
      formData.personalSpace === "Perfect balance of togetherness and independence" &&
      formData.boundaries === "All boundaries respected"
    ) {
      powerDynamics =
        "Balanced power dynamic characterized by mutual respect and autonomy. This equilibrium creates space for both individual and relationship growth."
    } else {
      powerDynamics =
        "Evolving power dynamic that may shift based on circumstances. Consider discussing how decisions are made and how boundaries are established."
    }

    // Determine growth potential
    if (positivePercentage >= 70) {
      growthPotential =
        "Strong foundation for continued growth and deepening intimacy. Your relationship demonstrates key elements of healthy attachment and communication."
      relationshipType = "Committed Relationship"
      decodeMessage =
        "Your connection exhibits the hallmarks of a committed relationship with secure attachment tendencies. The consistency in behavior, emotional availability, and mutual respect create a foundation for lasting intimacy."
      if (strengths.length > 0) {
        decodeMessage += ` Your relationship's greatest strengths include ${strengths.slice(0, 3).join(", ")}, which research links to relationship satisfaction and longevity.`
      }
      icon = "strong"
    } else if (positivePercentage >= 50) {
      growthPotential =
        "Moderate potential for growth with focused attention on key areas. Consider relationship education resources to strengthen your connection."
      relationshipType = "Evolving Relationship"
      decodeMessage =
        "Your relationship is in a developmental phase with elements of both secure and insecure attachment. There's evidence of emotional investment and connection, alongside areas that would benefit from greater clarity and consistency."
      if (strengths.length > 0) {
        decodeMessage += ` Your connection's strengths include ${strengths.slice(0, 2).join(" and ")}, providing a foundation to build upon.`
      }
      if (challenges.length > 0) {
        decodeMessage += ` Focusing on ${challenges.slice(0, 2).join(" and ")} would help establish greater security in your attachment.`
      }
      icon = "potential"
    } else {
      growthPotential =
        "Significant work needed to establish healthy relationship patterns. Consider whether this relationship meets your core emotional needs."
      relationshipType = "Undefined Situationship"
      decodeMessage =
        "Your connection currently exists in an ambiguous territory characterized by attachment insecurity. The inconsistency in expectations, behaviors, and emotional availability creates an unstable foundation that may be causing anxiety or avoidance patterns."
      if (challenges.length > 0) {
        decodeMessage += ` The primary areas requiring attention include ${challenges.slice(0, 3).join(", ")}, which are essential for establishing relationship security.`
      }
      decodeMessage +=
        " A direct conversation about relationship needs and boundaries would provide clarity about whether this connection can evolve into something more defined and secure."
      icon = "uncertain"
    }

    // Add deeper psychological insights
    decodeMessage += `\n\nAttachment Analysis: ${attachmentStyle}\n\nCommunication Pattern: ${communicationPattern}\n\nPower Dynamics: ${powerDynamics}\n\nGrowth Potential: ${growthPotential}`

    // Add milestone insights
    if (milestoneInsight) {
      decodeMessage += milestoneInsight
    }

    // Add astrological insights if available
    if (formData.userBirthday && formData.partnerBirthday) {
      const userSign = getZodiac(formData.userBirthday)
      const partnerSign = getZodiac(formData.partnerBirthday)
      const compatibility = getCompatibility(userSign, partnerSign)

      decodeMessage += `\n\nAstrological Insight: As a ${userSign} and ${partnerSign}, your signs are ${compatibility}. ${userSign} tends to be ${getSignTrait(userSign)}, while ${partnerSign} is often ${getSignTrait(partnerSign)}. This combination can create ${getAstrologicalDynamics(userSign, partnerSign)}.`
    }

    if (formData.additionalContext) {
      decodeMessage +=
        "\n\nYour additional context provides important nuance to this analysis. Remember that every relationship is unique and follows its own developmental trajectory. Trust your intuition while considering these insights."
    }

    return {
      message: decodeMessage,
      icon,
      relationshipType,
      positivePercentage: Math.round(positivePercentage),
      strengths: strengths.slice(0, 3),
      challenges: challenges.slice(0, 3),
      attachmentStyle: attachmentStyle.split(".")[0],
      communicationPattern: communicationPattern.split(".")[0],
      powerDynamics: powerDynamics.split(".")[0],
      growthPotential: growthPotential.split(".")[0],
      relationshipTrajectory,
    }
  }

  const getSignTrait = (sign) => {
    const traits = {
      Aries: "passionate and direct",
      Taurus: "reliable and patient",
      Gemini: "adaptable and curious",
      Cancer: "nurturing and intuitive",
      Leo: "generous and warm-hearted",
      Virgo: "analytical and practical",
      Libra: "diplomatic and social",
      Scorpio: "intense and determined",
      Sagittarius: "optimistic and freedom-loving",
      Capricorn: "disciplined and responsible",
      Aquarius: "innovative and independent",
      Pisces: "compassionate and artistic",
    }
    return traits[sign] || ""
  }

  const getAstrologicalDynamics = (sign1, sign2) => {
    const combinations = {
      "Aries-Leo": "a passionate and dynamic relationship with strong leadership energy",
      "Taurus-Virgo": "a grounded and practical partnership focused on stability",
      "Gemini-Libra": "an intellectually stimulating connection with excellent communication",
      "Cancer-Pisces": "a deeply emotional and intuitive bond with strong empathy",
      "Leo-Sagittarius": "an adventurous and expressive relationship full of optimism",
      "Virgo-Capricorn": "a responsible and goal-oriented partnership with shared values",
      "Libra-Aquarius": "a socially conscious relationship with focus on equality and ideals",
      "Scorpio-Pisces": "an intense emotional connection with profound depth",
      "Sagittarius-Aquarius": "a freedom-loving partnership focused on growth and exploration",
      "Capricorn-Taurus": "a security-focused relationship with strong work ethic",
      "Aquarius-Gemini": "an intellectually stimulating bond with innovative thinking",
      "Pisces-Cancer": "a nurturing and compassionate connection with emotional understanding",
    }

    const key1 = `${sign1}-${sign2}`
    const key2 = `${sign2}-${sign1}`

    return combinations[key1] || combinations[key2] || "a relationship with both complementary and challenging aspects"
  }

  const renderIcon = (icon) => {
    if (icon === "strong") return <Heart className="h-8 w-8 text-pink-500" />
    if (icon === "potential") return <Sparkles className="h-8 w-8 text-amber-500" />
    return <AlertCircle className="h-8 w-8 text-purple-500" />
  }

  return (
    <div className="max-w-md mx-auto">
      <Card className="shadow-md border-purple-100">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold">Situationship Decoder</CardTitle>
          <CardDescription className="text-purple-100">Decode your relationship with AI and astrology</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {progress > 0 && (
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Completion</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="emotional">Emotional</TabsTrigger>
              <TabsTrigger value="dynamics">Dynamics</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                  Duration <span className="text-red-500">*</span>
                </label>
                <Select value={formData.duration} onValueChange={(value) => handleChange("duration", value)}>
                  <SelectTrigger id="duration" className="w-full">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {durationOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-1">
                  Communication Frequency <span className="text-red-500">*</span>
                </label>
                <Select value={formData.frequency} onValueChange={(value) => handleChange("frequency", value)}>
                  <SelectTrigger id="frequency" className="w-full">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    {frequencyOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label htmlFor="communication" className="block text-sm font-medium text-gray-700 mb-1">
                  Communication Method <span className="text-red-500">*</span>
                </label>
                <Select value={formData.communication} onValueChange={(value) => handleChange("communication", value)}>
                  <SelectTrigger id="communication" className="w-full">
                    <SelectValue placeholder="Select communication" />
                  </SelectTrigger>
                  <SelectContent>
                    {communicationOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label htmlFor="emotionalIntensity" className="block text-sm font-medium text-gray-700 mb-1">
                  Emotional Intensity <span className="text-red-500">*</span>
                </label>
                <Select
                  value={formData.emotionalIntensity}
                  onValueChange={(value) => handleChange("emotionalIntensity", value)}
                >
                  <SelectTrigger id="emotionalIntensity" className="w-full">
                    <SelectValue placeholder="Select emotional intensity" />
                  </SelectTrigger>
                  <SelectContent>
                    {emotionalIntensityOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label htmlFor="expectations" className="block text-sm font-medium text-gray-700 mb-1">
                  Relationship Status/Expectations <span className="text-red-500">*</span>
                </label>
                <Select value={formData.expectations} onValueChange={(value) => handleChange("expectations", value)}>
                  <SelectTrigger id="expectations" className="w-full">
                    <SelectValue placeholder="Select expectations" />
                  </SelectTrigger>
                  <SelectContent>
                    {expectationsOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label htmlFor="behaviors" className="block text-sm font-medium text-gray-700 mb-1">
                  Partner's Behaviors <span className="text-red-500">*</span>
                </label>
                <Select value={formData.behaviors} onValueChange={(value) => handleChange("behaviors", value)}>
                  <SelectTrigger id="behaviors" className="w-full">
                    <SelectValue placeholder="Select behaviors" />
                  </SelectTrigger>
                  <SelectContent>
                    {behaviorsOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label htmlFor="feelings" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Feelings <span className="text-red-500">*</span>
                </label>
                <Select value={formData.feelings} onValueChange={(value) => handleChange("feelings", value)}>
                  <SelectTrigger id="feelings" className="w-full">
                    <SelectValue placeholder="Select feelings" />
                  </SelectTrigger>
                  <SelectContent>
                    {feelingsOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label htmlFor="physicalIntimacy" className="block text-sm font-medium text-gray-700 mb-1">
                  Physical Intimacy Level <span className="text-red-500">*</span>
                </label>
                <Select
                  value={formData.physicalIntimacy}
                  onValueChange={(value) => handleChange("physicalIntimacy", value)}
                >
                  <SelectTrigger id="physicalIntimacy" className="w-full">
                    <SelectValue placeholder="Select physical intimacy level" />
                  </SelectTrigger>
                  <SelectContent>
                    {physicalIntimacyOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="emotional" className="space-y-4">
              <div className="text-sm text-gray-500 mb-2">
                These questions help analyze the emotional depth of your connection
              </div>

              {/* Trust & Security Section */}
              <div>
                <label htmlFor="trustLevel" className="block text-sm font-medium text-gray-700 mb-1">
                  Trust Level
                </label>
                <Select value={formData.trustLevel} onValueChange={(value) => handleChange("trustLevel", value)}>
                  <SelectTrigger id="trustLevel" className="w-full">
                    <SelectValue placeholder="Select trust level" />
                  </SelectTrigger>
                  <SelectContent>
                    {trustLevelOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label htmlFor="jealousy" className="block text-sm font-medium text-gray-700 mb-1">
                  Jealousy
                </label>
                <Select value={formData.jealousy} onValueChange={(value) => handleChange("jealousy", value)}>
                  <SelectTrigger id="jealousy" className="w-full">
                    <SelectValue placeholder="Select jealousy level" />
                  </SelectTrigger>
                  <SelectContent>
                    {jealousyOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label htmlFor="transparency" className="block text-sm font-medium text-gray-700 mb-1">
                  Transparency
                </label>
                <Select value={formData.transparency} onValueChange={(value) => handleChange("transparency", value)}>
                  <SelectTrigger id="transparency" className="w-full">
                    <SelectValue placeholder="Select transparency level" />
                  </SelectTrigger>
                  <SelectContent>
                    {transparencyOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Emotional Connection Section */}
              <div>
                <label htmlFor="emotionalSupport" className="block text-sm font-medium text-gray-700 mb-1">
                  Emotional Support
                </label>
                <Select
                  value={formData.emotionalSupport}
                  onValueChange={(value) => handleChange("emotionalSupport", value)}
                >
                  <SelectTrigger id="emotionalSupport" className="w-full">
                    <SelectValue placeholder="Select emotional support level" />
                  </SelectTrigger>
                  <SelectContent>
                    {emotionalSupportOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label htmlFor="vulnerability" className="block text-sm font-medium text-gray-700 mb-1">
                  Vulnerability
                </label>
                <Select value={formData.vulnerability} onValueChange={(value) => handleChange("vulnerability", value)}>
                  <SelectTrigger id="vulnerability" className="w-full">
                    <SelectValue placeholder="Select vulnerability level" />
                  </SelectTrigger>
                  <SelectContent>
                    {vulnerabilityOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label htmlFor="empathy" className="block text-sm font-medium text-gray-700 mb-1">
                  Empathy
                </label>
                <Select value={formData.empathy} onValueChange={(value) => handleChange("empathy", value)}>
                  <SelectTrigger id="empathy" className="w-full">
                    <SelectValue placeholder="Select empathy level" />
                  </SelectTrigger>
                  <SelectContent>
                    {empathyOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Future & Commitment Section */}
              <div>
                <label htmlFor="futureDiscussions" className="block text-sm font-medium text-gray-700 mb-1">
                  Future Discussions
                </label>
                <Select
                  value={formData.futureDiscussions}
                  onValueChange={(value) => handleChange("futureDiscussions", value)}
                >
                  <SelectTrigger id="futureDiscussions" className="w-full">
                    <SelectValue placeholder="Select future discussions frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    {futureDiscussionsOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="dynamics" className="space-y-4">
              <div className="text-sm text-gray-500 mb-2">
                These questions help analyze how you interact and resolve issues
              </div>

              {/* Conflict Resolution Section */}
              <div>
                <label htmlFor="conflictFrequency" className="block text-sm font-medium text-gray-700 mb-1">
                  Conflict Frequency
                </label>
                <Select
                  value={formData.conflictFrequency}
                  onValueChange={(value) => handleChange("conflictFrequency", value)}
                >
                  <SelectTrigger id="conflictFrequency" className="w-full">
                    <SelectValue placeholder="Select conflict frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    {conflictFrequencyOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label htmlFor="conflictResolution" className="block text-sm font-medium text-gray-700 mb-1">
                  Conflict Resolution
                </label>
                <Select
                  value={formData.conflictResolution}
                  onValueChange={(value) => handleChange("conflictResolution", value)}
                >
                  <SelectTrigger id="conflictResolution" className="w-full">
                    <SelectValue placeholder="Select conflict resolution style" />
                  </SelectTrigger>
                  <SelectContent>
                    {conflictResolutionOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label htmlFor="afterConflict" className="block text-sm font-medium text-gray-700 mb-1">
                  After Conflict
                </label>
                <Select value={formData.afterConflict} onValueChange={(value) => handleChange("afterConflict", value)}>
                  <SelectTrigger id="afterConflict" className="w-full">
                    <SelectValue placeholder="Select post-conflict state" />
                  </SelectTrigger>
                  <SelectContent>
                    {afterConflictOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Balance & Boundaries Section */}
              <div>
                <label htmlFor="personalSpace" className="block text-sm font-medium text-gray-700 mb-1">
                  Personal Space
                </label>
                <Select value={formData.personalSpace} onValueChange={(value) => handleChange("personalSpace", value)}>
                  <SelectTrigger id="personalSpace" className="w-full">
                    <SelectValue placeholder="Select personal space balance" />
                  </SelectTrigger>
                  <SelectContent>
                    {personalSpaceOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label htmlFor="socialDynamics" className="block text-sm font-medium text-gray-700 mb-1">
                  Social Dynamics
                </label>
                <Select
                  value={formData.socialDynamics}
                  onValueChange={(value) => handleChange("socialDynamics", value)}
                >
                  <SelectTrigger id="socialDynamics" className="w-full">
                    <SelectValue placeholder="Select social dynamics" />
                  </SelectTrigger>
                  <SelectContent>
                    {socialDynamicsOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label htmlFor="boundaries" className="block text-sm font-medium text-gray-700 mb-1">
                  Boundaries
                </label>
                <Select value={formData.boundaries} onValueChange={(value) => handleChange("boundaries", value)}>
                  <SelectTrigger id="boundaries" className="w-full">
                    <SelectValue placeholder="Select boundaries respect level" />
                  </SelectTrigger>
                  <SelectContent>
                    {boundariesOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Astrology Section */}
              <div className="pt-2 border-t border-gray-200">
                <h3 className="text-sm font-medium text-purple-600 mb-2">Astrological Insights (Optional)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="userBirthday" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Birthday
                    </label>
                    <Input
                      type="date"
                      id="userBirthday"
                      value={formData.userBirthday}
                      onChange={(e) => handleChange("userBirthday", e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="partnerBirthday" className="block text-sm font-medium text-gray-700 mb-1">
                      Partner's Birthday
                    </label>
                    <Input
                      type="date"
                      id="partnerBirthday"
                      value={formData.partnerBirthday}
                      onChange={(e) => handleChange("partnerBirthday", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="additionalContext" className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Context (optional)
                </label>
                <Textarea
                  id="additionalContext"
                  value={formData.additionalContext}
                  onChange={(e) => handleChange("additionalContext", e.target.value)}
                  placeholder="Any additional details about your relationship..."
                  className="min-h-[80px]"
                />
              </div>
            </TabsContent>

            <TabsContent value="timeline" className="space-y-4">
              <div className="text-sm text-gray-500 mb-2">
                Add key milestones in your relationship to visualize your journey together
              </div>

              <div className="space-y-4 border rounded-md p-4 bg-gray-50">
                <h3 className="font-medium">Add New Milestone</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label htmlFor="milestone-date" className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <Input
                      type="date"
                      id="milestone-date"
                      value={newMilestone.date}
                      onChange={(e) => handleMilestoneChange("date", e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="milestone-type" className="block text-sm font-medium text-gray-700 mb-1">
                      Type
                    </label>
                    <Select value={newMilestone.type} onValueChange={(value) => handleMilestoneChange("type", value)}>
                      <SelectTrigger id="milestone-type">
                        <SelectValue placeholder="Select milestone type" />
                      </SelectTrigger>
                      <SelectContent>
                        {milestoneTypeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label htmlFor="milestone-description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <Textarea
                      id="milestone-description"
                      value={newMilestone.description}
                      onChange={(e) => handleMilestoneChange("description", e.target.value)}
                      placeholder="e.g., First date, First kiss, First argument, etc."
                      className="min-h-[60px]"
                    />
                  </div>
                  <Button
                    onClick={addMilestone}
                    className="w-full flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-600"
                  >
                    <Plus className="h-4 w-4" /> Add Milestone
                  </Button>
                </div>
              </div>

              {milestones.length > 0 ? (
                <div className="mt-6">
                  <h3 className="font-medium mb-4">Your Relationship Timeline</h3>
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-purple-200"></div>

                    {/* Timeline events */}
                    <div className="space-y-6 pl-12 relative">
                      {milestones
                        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                        .map((milestone) => (
                          <div key={milestone.id} className="relative">
                            {/* Timeline dot */}
                            <div
                              className={`absolute -left-12 w-4 h-4 rounded-full border-2 border-white ${
                                milestone.type === "positive"
                                  ? "bg-green-500"
                                  : milestone.type === "neutral"
                                    ? "bg-blue-500"
                                    : milestone.type === "challenging"
                                      ? "bg-amber-500"
                                      : "bg-red-500"
                              }`}
                            ></div>

                            {/* Content */}
                            <div className="flex flex-col space-y-1">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm font-medium">{formatDate(milestone.date)}</span>
                                </div>
                                <button
                                  onClick={() => removeMilestone(milestone.id)}
                                  className="text-gray-400 hover:text-red-500"
                                  aria-label="Remove milestone"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                              <div className={`p-3 rounded-md ${getMilestoneTypeColor(milestone.type)} border`}>
                                {milestone.description}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="h-12 w-12 mx-auto mb-2 opacity-30" />
                  <p>No milestones added yet</p>
                  <p className="text-sm">Add key moments to visualize your relationship journey</p>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <Button
            className="mt-6 w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            onClick={handleDecode}
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Decode Your Situationship"}
          </Button>

          {decode && (
            <Card className="mt-6 border-purple-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="mt-1">{renderIcon(decode.icon)}</div>
                  <div className="space-y-2">
                    <h3 className="font-bold text-lg">{decode.relationshipType}</h3>
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-gray-500">Compatibility Score:</div>
                      <div className="flex items-center">
                        <Progress value={decode.positivePercentage} className="h-2 w-24" />
                        <span className="ml-2 text-sm font-medium">{decode.positivePercentage}%</span>
                      </div>
                    </div>
                    {decode.strengths.length > 0 && (
                      <div className="text-sm">
                        <span className="font-medium text-green-600">Strengths:</span> {decode.strengths.join(", ")}
                      </div>
                    )}
                    {decode.challenges.length > 0 && (
                      <div className="text-sm">
                        <span className="font-medium text-amber-600">Areas to work on:</span>{" "}
                        {decode.challenges.join(", ")}
                      </div>
                    )}
                    <p className="whitespace-pre-line text-gray-700 mt-2">{decode.message}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
