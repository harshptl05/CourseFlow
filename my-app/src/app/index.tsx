import React, { useMemo, useState } from "react";
import {
  SafeAreaView, ScrollView, StyleSheet, Text, TextInput, Pressable,
  View, Modal, Platform,
} from "react-native";

type Article = {
  id: string; category: string; title: string; publisher: string;
  kind: string; summary: string; date: string; course: string; image?: string;
};

const initialArticles: Article[] = [
  { id: "ml1", category: "Machine Learning", title: "New method enables AI for safety-critical situations", publisher: "MIT News", kind: "NEWS", summary: "HardFlow steers pretrained generative models toward outputs that meet strict constraints, without retraining. Its experiments explore robotics, physical control and image editing.", date: "Sep 14, 2026", course: "CS 4375" },
  { id: "se1", category: "Software Engineering", title: "How an MIT research project became a global programming language", publisher: "MIT News", kind: "NEWS", summary: "Julia grew from researchers’ frustration with slow numerical workflows into an open-source language for scientific computing. MIT News traces its origins, community and relationship to JuliaHub.", date: "Aug 31, 2026", course: "CS 3354" },
  { id: "se2", category: "Software Engineering", title: "GitLab’s internal playbook to foster AI-fluent technical teams", publisher: "GitLab Blog", kind: "INDUSTRY", summary: "GitLab describes its internal approach to building AI fluency through collaboration between talent development and enterprise technology. The focus is on judgment and workflows as well as access to tools.", date: "Sep 2, 2026", course: "CS 3354" },
  { id: "st1", category: "Statistics", title: "Tidy Data", publisher: "Journal of Statistical Software", kind: "FOUNDATIONAL PAPER", summary: "Wickham presents a consistent structure for analysis-ready datasets. Organizing observations, variables and observational units makes data easier to reshape, model and visualize.", date: "Sep 12, 2014", course: "STAT 3355" },
  { id: "st2", category: "Statistics", title: "A Gentle Introduction to Conformal Prediction and Distribution-Free Uncertainty Quantification", publisher: "arXiv", kind: "TUTORIAL PREPRINT", summary: "This tutorial introduces prediction sets and intervals that quantify uncertainty around model outputs. It combines practical theory with worked examples and Python notebooks.", date: "Jul 15, 2021", course: "STAT 3355" },
  { id: "ml2", category: "Machine Learning", title: "Explainable AI: learning from the learners", publisher: "Nature Communications", kind: "PERSPECTIVE", summary: "This perspective explores how explanations can help scientists learn from AI models. The authors connect discovery, optimization and certification to causal reasoning and domain validation.", date: "Aug 6, 2026", course: "CS 4375" },
  { id: "ai1", category: "Machine Learning", title: "MIT Schwarzman College of Computing launches pilot to help educators teach AI across disciplines", publisher: "MIT News", kind: "NEWS", summary: "A weeklong MIT pilot helped higher-education instructors adapt machine-learning concepts and teaching materials to their disciplines through demonstrations, exercises and collaboration.", date: "Sep 9, 2026", course: "CS 4375" },
];

const courses = [
  { id: "CS 4375", name: "Machine Learning", color: "#F0EDFF", icon: "♜", suggested: 5 },
  { id: "CS 3354", name: "Software Engineering", color: "#EDF4E9", icon: "⌘", suggested: 3 },
  { id: "STAT 3355", name: "Data Analysis", color: "#F8EFDC", icon: "▥", suggested: 2 },
];

type Tab = "Home" | "Saved" | "Courses" | "Settings" | "Explore" | "Brief";

export default function HomeScreen() {
  const [tab, setTab] = useState<Tab>("Home");
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [researchOnly, setResearchOnly] = useState(false);
  const [saved, setSaved] = useState<string[]>([]);
  const [assignments, setAssignments] = useState<Record<string, string[]>>({
    "CS 4375": ["ml2"], "CS 3354": ["se1"], "STAT 3355": ["st1"],
  });
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [courseModalArticle, setCourseModalArticle] = useState<Article | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [chosenCourse, setChosenCourse] = useState("");
  const [notice, setNotice] = useState("");
  const [selectedTopics, setSelectedTopics] = useState(["Machine Learning", "Statistics", "Software Engineering"]);
  const [notifications, setNotifications] = useState(true);
  const [briefTime, setBriefTime] = useState("8:00 AM");
  const [activePublisher, setActivePublisher] = useState("All");

  const filtered = useMemo(() => initialArticles.filter(a => {
    const q = query.trim().toLowerCase();
    const matchQuery = !q || [a.title, a.summary, a.publisher, a.category].some(s => s.toLowerCase().includes(q));
    const matchCategory = activeCategory === "All" || a.category === activeCategory;
    const matchResearch = !researchOnly || ["FOUNDATIONAL PAPER", "TUTORIAL PREPRINT", "PERSPECTIVE"].includes(a.kind);
    const matchPublisher = activePublisher === "All" || (activePublisher === "News" ? a.kind === "NEWS" : a.kind !== "NEWS");
    return matchQuery && matchCategory && matchResearch && matchPublisher;
  }), [query, activeCategory, researchOnly, activePublisher]);

  const toggleSaved = (id: string) => setSaved(current => current.includes(id) ? current.filter(x => x !== id) : [...current, id]);
  const openSearch = (topic = "") => { setQuery(topic); setActiveCategory(topic || "All"); setResearchOnly(false); setTab("Home"); setSelectedCourse(null); };
  const goTab = (next: Tab) => { setTab(next); setSelectedCourse(null); setQuery(""); setNotice(""); };

  const articleCard = (a: Article, showAdd = true) => (
    <View key={a.id} style={styles.article}>
      <Pressable onPress={() => setSelectedArticle(a)}>
        <Text style={styles.meta}>{a.publisher.toUpperCase()} · {a.kind}</Text>
        <Text style={styles.articleTitle}>{a.title}</Text>
        <Text style={styles.summary}>{a.summary}</Text>
        <Text style={styles.meta}>{a.date} · 1 min summary</Text>
      </Pressable>
      <Text style={styles.relevant}>Relevant to {a.course}</Text>
      <View style={styles.actions}>
        <Pressable onPress={() => toggleSaved(a.id)}><Text style={styles.action}>{saved.includes(a.id) ? "✓ Saved" : "Save"}</Text></Pressable>
        {showAdd && <Pressable onPress={() => { setCourseModalArticle(a); setChosenCourse(""); }}><Text style={styles.action}>Add</Text></Pressable>}
        <Pressable onPress={() => setSelectedArticle(a)}><Text style={styles.action}>Read</Text></Pressable>
      </View>
    </View>
  );

  const header = (title: string) => (
    <View style={styles.topbar}>
      <Text style={styles.back} onPress={() => selectedCourse ? setSelectedCourse(null) : goTab("Home")}>‹</Text>
      <Text style={styles.topTitle}>{title}</Text>
      <Pressable onPress={() => { setTab("Home"); setQuery(""); }}><Text style={styles.searchIcon}>⌕</Text></Pressable>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.app}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {tab === "Home" && !selectedCourse && <>
            <View style={styles.brandRow}>
              <View><Text style={styles.brand}>CourseFlow</Text><Text style={styles.tagline}>Your research, organized.</Text></View>
              <Pressable style={styles.savedPill} onPress={() => goTab("Saved")}><Text style={styles.savedPillText}>♡ {saved.length} saved</Text></Pressable>
            </View>
            <Text style={styles.eyebrow}>YOUR RESEARCH FEED</Text>
            <Text style={styles.serifHeading}>Ideas for your next lecture.</Text>
            <Text style={styles.bodyIntro}>Discover research and resources for your courses.</Text>
            <TextInput style={styles.searchInput} value={query} onChangeText={setQuery} placeholder="Search articles, topics & publishers" placeholderTextColor="#8E8B99" />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
              {["All", "Machine Learning", "Statistics", "Software Engineering"].map(c => <Pressable key={c} onPress={() => setActiveCategory(c)} style={[styles.chip, activeCategory === c && styles.chipOn]}><Text style={[styles.chipText, activeCategory === c && styles.chipTextOn]}>{c}</Text></Pressable>)}
            </ScrollView>
            <View style={styles.toggleRow}>
              <Pressable style={[styles.filterBtn, !researchOnly && styles.filterOn]} onPress={() => setResearchOnly(false)}><Text style={[styles.filterText, !researchOnly && styles.filterTextOn]}>All material</Text></Pressable>
              <Pressable style={[styles.filterBtn, researchOnly && styles.filterOn]} onPress={() => setResearchOnly(true)}><Text style={[styles.filterText, researchOnly && styles.filterTextOn]}>Research only</Text></Pressable>
            </View>
            <Text style={styles.count}>{filtered.length} verified resources</Text>
            {filtered.length ? filtered.map(a => articleCard(a)) : <Text style={styles.empty}>No matching resources. Try another search.</Text>}
          </>}

          {tab === "Explore" && <>
            {header("Explore")}
            <Text style={styles.serifHeading}>Follow your curiosity.</Text>
            <TextInput style={styles.searchInput} value={query} onChangeText={setQuery} placeholder="Search topics, papers & publishers" placeholderTextColor="#8E8B99" />
            <Text style={styles.sectionTitle}>Recent searches</Text>
            {["Machine Learning", "Software Engineering", "Statistics"].map(t => <Pressable key={t} style={styles.recent} onPress={() => openSearch(t)}><Text style={styles.action}>{t} →</Text></Pressable>)}
            <Text style={styles.sectionTitle}>Topic collections</Text>
            <Text style={styles.smallLabel}>For your courses</Text>
            <View style={styles.courseGrid}>{courses.map(c => <Pressable key={c.id} style={[styles.courseTile,{backgroundColor:c.color}]} onPress={() => {setSelectedCourse(c.id);setTab("Courses");}}><Text style={styles.courseCode}>{c.id}</Text><Text style={styles.courseName}>{c.name}</Text><Text style={styles.meta}>{assignments[c.id]?.length || 0} resources</Text><Text style={styles.action}>View materials →</Text></Pressable>)}</View>
            <Text style={styles.sectionTitle}>Featured publishers</Text>
            <View style={styles.toggleRow}>{["All","News","Research"].map(p=><Pressable key={p} style={[styles.filterBtn,activePublisher===p&&styles.filterOn]} onPress={()=>{setActivePublisher(p);setTab("Home");}}><Text style={[styles.filterText,activePublisher===p&&styles.filterTextOn]}>{p}</Text></Pressable>)}</View>
            <Text style={styles.sectionTitle}>Latest reporting</Text>
            {initialArticles.slice(0,2).map(a=>articleCard(a))}
          </>}

          {tab === "Brief" && <>
            {header("Your Daily Brief")}
            <Text style={styles.serifHeading}>Three ideas for your next lecture.</Text>
            <Text style={styles.meta}>SUNDAY, OCTOBER 11, 2026</Text>
            {initialArticles.slice(0,3).map((a,i)=><View key={a.id}><Text style={styles.eyebrow}>{String(i+1).padStart(2,"0")} / {a.category.toUpperCase()}</Text>{articleCard(a)}</View>)}
          </>}

          {tab === "Saved" && <>
            {header("Saved resources")}
            <Text style={styles.serifHeading}>Your reading list.</Text>
            <Text style={styles.bodyIntro}>Resources you’ve saved for later.</Text>
            {initialArticles.filter(a=>saved.includes(a.id)).length ? initialArticles.filter(a=>saved.includes(a.id)).map(a=>articleCard(a)) : <View style={styles.emptyCard}><Text style={styles.sectionTitle}>Nothing saved yet</Text><Text style={styles.summary}>Browse your feed and tap Save to collect resources here.</Text><Pressable style={styles.primaryBtn} onPress={()=>goTab("Home")}><Text style={styles.primaryText}>Explore resources</Text></Pressable></View>}
          </>}

          {tab === "Courses" && <>
            {header(selectedCourse || "My courses")}
            {!selectedCourse ? <>
              <Text style={styles.sectionTitle}>My courses</Text>
              <Text style={styles.serifHeading}>A library for every classroom.</Text>
              {courses.map(c=><Pressable key={c.id} style={[styles.courseCard,{backgroundColor:c.color}]} onPress={()=>setSelectedCourse(c.id)}>
                <Text style={styles.courseCode}>{c.icon}  {c.id}</Text><Text style={styles.courseName}>{c.name}</Text>
                <Text style={styles.meta}>{assignments[c.id]?.length || 0} resource(s)</Text>
                <Text style={styles.summary}>Suggested reading: {c.suggested} curated resources</Text>
                <View style={styles.viewMaterials}><Text style={styles.action}>View materials →</Text></View>
              </Pressable>)}
            </> : <>
              <Text style={styles.serifHeading}>{courses.find(c=>c.id===selectedCourse)?.name}</Text>
              <Text style={styles.relevant}>{assignments[selectedCourse]?.length || 0} resource(s)</Text>
              <Text style={styles.sectionTitle}>Your materials</Text>
              <Text style={styles.summary}>Open a resource or remove it from this course.</Text>
              {initialArticles.filter(a=>(assignments[selectedCourse]||[]).includes(a.id)).map(a=><View key={a.id} style={styles.article}>{articleCard(a,false)}<Pressable onPress={()=>setAssignments(old=>({...old,[selectedCourse!]:old[selectedCourse!].filter(id=>id!==a.id)}))}><Text style={styles.action}>Remove from course</Text></Pressable></View>)}
              <Text style={styles.sectionTitle}>Suggested for this course</Text>
              {initialArticles.filter(a=>a.course===selectedCourse && !(assignments[selectedCourse]||[]).includes(a.id)).map(a=>articleCard(a))}
            </>}
          </>}

          {tab === "Settings" && <>
            {header("Settings")}
            <Text style={styles.serifHeading}>Make CourseFlow yours.</Text>
            <Text style={styles.sectionTitle}>Feed preferences</Text>
            <Text style={styles.summary}>Choose the topics you want to see in your feed.</Text>
            {["Machine Learning","Statistics","Software Engineering"].map(t=><Pressable key={t} style={styles.settingRow} onPress={()=>setSelectedTopics(old=>old.includes(t)?old.filter(x=>x!==t):[...old,t])}><Text style={styles.settingText}>{t}</Text><Text style={styles.action}>{selectedTopics.includes(t)?"✓":"○"}</Text></Pressable>)}
            <Text style={styles.sectionTitle}>Daily brief</Text>
            <Pressable style={styles.settingRow} onPress={()=>setNotifications(!notifications)}><Text style={styles.settingText}>Daily brief notifications</Text><Text style={styles.action}>{notifications?"ON":"OFF"}</Text></Pressable>
            <Text style={styles.smallLabel}>Delivery time</Text>
            <View style={styles.toggleRow}>{["8:00 AM","12:00 PM","5:00 PM"].map(t=><Pressable key={t} style={[styles.filterBtn,briefTime===t&&styles.filterOn]} onPress={()=>setBriefTime(t)}><Text style={[styles.filterText,briefTime===t&&styles.filterTextOn]}>{t}</Text></Pressable>)}</View>
            <Text style={styles.summary}>Current delivery time: {briefTime}</Text>
            <Pressable style={styles.primaryBtn} onPress={()=>setNotice("Your preferences have been updated.")}><Text style={styles.primaryText}>Save preferences</Text></Pressable>
            {!!notice && <Text style={styles.confirmation}>{notice}</Text>}
          </>}
        </ScrollView>

        {!selectedArticle && <View style={styles.bottomNav}>
          {([{label:"Home",icon:"⌂"},{label:"Saved",icon:"♧"},{label:"Courses",icon:"▣"},{label:"Settings",icon:"⚙"}] as {label:Tab;icon:string}[]).map(n=><Pressable key={n.label} onPress={()=>goTab(n.label)} style={styles.navItem}><Text style={[styles.navIcon,tab===n.label&&styles.navActive]}>{n.icon}</Text><Text style={[styles.navLabel,tab===n.label&&styles.navActive]}>{n.label}</Text></Pressable>)}
        </View>}

        <Modal visible={!!courseModalArticle} transparent animationType="slide" onRequestClose={()=>setCourseModalArticle(null)}>
          <View style={styles.modalShade}><View style={styles.modalCard}>
            <View style={styles.modalHead}><Text style={styles.sectionTitle}>Add to course</Text><Pressable onPress={()=>setCourseModalArticle(null)}><Text style={styles.action}>×</Text></Pressable></View>
            <Text style={styles.summary}>{courseModalArticle?.title}</Text>
            {courses.map(c=><Pressable key={c.id} onPress={()=>setChosenCourse(c.id)} style={[styles.courseChoice,chosenCourse===c.id&&styles.courseChoiceOn]}><Text style={styles.action}>{c.id} - {c.name}</Text></Pressable>)}
            <Pressable disabled={!chosenCourse} style={[styles.primaryBtn,!chosenCourse&&styles.disabledBtn]} onPress={()=>{if(courseModalArticle&&chosenCourse){setAssignments(old=>({...old,[chosenCourse]:Array.from(new Set([...(old[chosenCourse]||[]),courseModalArticle.id]))}));setNotice(`Added to ${chosenCourse}`);setCourseModalArticle(null);}}}><Text style={styles.primaryText}>Choose a course to continue</Text></Pressable>
            <Pressable style={styles.cancel} onPress={()=>setCourseModalArticle(null)}><Text style={styles.action}>Cancel</Text></Pressable>
          </View></View>
        </Modal>

        <Modal visible={!!selectedArticle} animationType="slide" onRequestClose={()=>setSelectedArticle(null)}>
          <SafeAreaView style={styles.safe}><ScrollView contentContainerStyle={styles.content}>
            <View style={styles.topbar}><Pressable onPress={()=>setSelectedArticle(null)}><Text style={styles.back}>‹</Text></Pressable><Text style={styles.topTitle}>Resource details</Text><Text style={styles.searchIcon}>⌕</Text></View>
            {selectedArticle && <><Text style={styles.meta}>{selectedArticle.publisher.toUpperCase()} · {selectedArticle.kind}</Text><Text style={styles.serifHeading}>{selectedArticle.title}</Text><Text style={styles.meta}>{selectedArticle.date} · 1 min summary</Text><Text style={styles.summaryLarge}>{selectedArticle.summary}</Text><View style={styles.actions}><Pressable onPress={()=>toggleSaved(selectedArticle.id)}><Text style={styles.action}>{saved.includes(selectedArticle.id)?"✓ Saved":"Save"}</Text></Pressable><Pressable onPress={()=>{setCourseModalArticle(selectedArticle);setSelectedArticle(null);}}><Text style={styles.action}>Add to course</Text></Pressable></View></>}
          </ScrollView></SafeAreaView>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:{flex:1,backgroundColor:"#FAF9F6"},
  app:{flex:1,width:"100%",maxWidth:520,alignSelf:"center",backgroundColor:"#FAF9F6",borderLeftWidth:Platform.OS==="web"?1:0,borderRightWidth:Platform.OS==="web"?1:0,borderColor:"#EEEAE6"},
  content:{paddingHorizontal:20,paddingTop:12,paddingBottom:28},
  brandRow:{flexDirection:"row",justifyContent:"space-between",alignItems:"center",marginBottom:27},
  brand:{fontSize:22,fontWeight:"800",color:"#262638"},tagline:{fontSize:12,color:"#85818A",marginTop:3},
  savedPill:{backgroundColor:"#F0EDFF",paddingHorizontal:12,paddingVertical:9,borderRadius:18},savedPillText:{fontSize:12,color:"#7462D8",fontWeight:"700"},
  eyebrow:{fontSize:10,letterSpacing:1.1,color:"#7868DB",fontWeight:"800",marginTop:15,marginBottom:8},
  serifHeading:{fontSize:28,lineHeight:35,color:"#292833",fontFamily:Platform.OS==="web"?"Georgia":undefined,marginTop:8,marginBottom:12},
  bodyIntro:{fontSize:13,lineHeight:20,color:"#85818A",marginBottom:16},
  searchInput:{backgroundColor:"#F0EDFF",borderRadius:10,paddingHorizontal:14,paddingVertical:13,fontSize:12,color:"#343044",marginBottom:13},
  chips:{gap:8,paddingBottom:10},chip:{borderRadius:20,borderWidth:1,borderColor:"#E5E0F7",paddingVertical:8,paddingHorizontal:11,backgroundColor:"#FFF"},chipOn:{backgroundColor:"#7868DB",borderColor:"#7868DB"},chipText:{fontSize:11,color:"#665F7D"},chipTextOn:{color:"#FFF"},
  toggleRow:{flexDirection:"row",gap:8,justifyContent:"space-between",marginVertical:10},filterBtn:{flex:1,alignItems:"center",paddingVertical:10,paddingHorizontal:7,borderRadius:9,backgroundColor:"#FFF"},filterOn:{backgroundColor:"#EDE9FF"},filterText:{fontSize:11,color:"#777184"},filterTextOn:{color:"#6553C6",fontWeight:"700"},
  count:{fontSize:11,color:"#8A8490",marginTop:8,marginBottom:5},article:{borderBottomWidth:1,borderBottomColor:"#ECE8E4",paddingVertical:16},meta:{fontSize:9,color:"#918B95",lineHeight:15,marginBottom:7},articleTitle:{fontSize:16,lineHeight:22,fontWeight:"800",color:"#292833",marginBottom:8},summary:{fontSize:12,lineHeight:18,color:"#8A8490",marginBottom:9},summaryLarge:{fontSize:15,lineHeight:25,color:"#66616D",marginTop:20,marginBottom:24},relevant:{fontSize:10,color:"#7868DB",marginVertical:8},actions:{flexDirection:"row",justifyContent:"flex-end",gap:25,marginTop:5},action:{fontSize:11,color:"#7868DB",fontWeight:"700"},empty:{paddingVertical:30,color:"#888",fontSize:13},
  topbar:{flexDirection:"row",alignItems:"center",justifyContent:"space-between",marginBottom:26,paddingVertical:8},back:{fontSize:24,color:"#7868DB",width:25},topTitle:{fontSize:12,fontWeight:"700",color:"#34313C",flex:1,marginLeft:8},searchIcon:{fontSize:25,color:"#8A8490"},
  sectionTitle:{fontSize:16,fontWeight:"800",color:"#302D3A",marginTop:18,marginBottom:10},smallLabel:{fontSize:10,color:"#8A8490",marginTop:10,marginBottom:5},recent:{paddingVertical:11,borderBottomWidth:1,borderBottomColor:"#EEEAE6"},
  courseGrid:{flexDirection:"row",flexWrap:"wrap",gap:10,marginTop:10},courseTile:{width:"48%",borderRadius:12,padding:12,gap:8},courseCode:{fontSize:10,color:"#7868DB",fontWeight:"800"},courseName:{fontSize:14,fontWeight:"800",color:"#34313C"},courseCard:{borderRadius:13,padding:15,marginVertical:7},viewMaterials:{backgroundColor:"#FAF9F6",borderRadius:8,padding:10,alignItems:"center",marginTop:8},
  emptyCard:{padding:20,backgroundColor:"#FFF",borderRadius:12,marginTop:18},primaryBtn:{backgroundColor:"#B7ACE9",borderRadius:9,padding:13,alignItems:"center",marginTop:15},primaryText:{fontSize:12,color:"#FFF",fontWeight:"800"},disabledBtn:{opacity:.55},confirmation:{color:"#28784B",fontSize:12,marginTop:12,fontWeight:"700"},
  settingRow:{flexDirection:"row",justifyContent:"space-between",alignItems:"center",paddingVertical:16,borderBottomWidth:1,borderBottomColor:"#EDE8E3"},settingText:{fontSize:13,color:"#393542"},
  bottomNav:{height:61,borderTopWidth:1,borderTopColor:"#EAE6E1",backgroundColor:"#FAF9F6",flexDirection:"row",justifyContent:"space-around",alignItems:"center"},navItem:{alignItems:"center",gap:3,minWidth:55},navIcon:{fontSize:19,color:"#96909D"},navLabel:{fontSize:10,color:"#96909D"},navActive:{color:"#7868DB",fontWeight:"800"},
  modalShade:{flex:1,backgroundColor:"rgba(24,22,31,0.28)",justifyContent:"flex-end"},modalCard:{backgroundColor:"#FAF9F6",borderTopLeftRadius:22,borderTopRightRadius:22,padding:22,paddingBottom:32,minHeight:360},modalHead:{flexDirection:"row",justifyContent:"space-between",alignItems:"center",marginBottom:14},courseChoice:{padding:13,alignItems:"center",borderRadius:9,marginTop:5},courseChoiceOn:{backgroundColor:"#F0EDFF"},cancel:{alignItems:"center",padding:12,marginTop:5},
});